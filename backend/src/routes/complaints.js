import express from 'express';
import { coordinator } from '../coordinator/coordinator.js';
import { storage } from '../services/storage.js';

const router = express.Router();

/**
 * Submit a new complaint - Triggers autonomous Multi-Agent Coordinator
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, building, room, studentName, studentId, category, image } = req.body;

    if (!title || !description || !building || !room) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, description, building, and room are required."
      });
    }

    const complaintData = {
      title,
      description,
      building,
      room,
      studentName: studentName || "Aarav Sharma",
      studentId: studentId || "STU-2026-1049",
      categoryHint: category || null,
      image: image || null
    };

    const workflowResult = await coordinator.startWorkflow(complaintData);

    if (workflowResult.isDuplicate) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: workflowResult.message,
        ticketId: workflowResult.existingTicketId,
        ticket: workflowResult.ticket
      });
    }

    // Await completion or return workflowId for live polling
    // For fast feedback, if client wants async, return immediately with 202
    if (req.query.async === 'true') {
      return res.status(202).json({
        success: true,
        workflowId: workflowResult.workflowId,
        status: "Running",
        message: "AI agent workflow initialized. Monitor progress via /api/agents/workflows/" + workflowResult.workflowId
      });
    }

    // Default: wait for completion (usually 1-2s total)
    const finalWorkflow = await workflowResult.executionPromise;
    const createdTicket = storage.getComplaintById(finalWorkflow.ticketId);

    return res.status(201).json({
      success: true,
      workflowId: finalWorkflow.workflowId,
      ticketId: finalWorkflow.ticketId,
      ticket: createdTicket,
      workflow: finalWorkflow
    });
  } catch (err) {
    console.error("[ComplaintsRoute] Error processing complaint submission:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to process complaint with AI multi-agent system."
    });
  }
});

/**
 * List all complaints with filtering
 */
router.get('/', (req, res) => {
  try {
    const { status, priority, department, studentId, search } = req.query;
    const complaints = storage.getComplaints({
      status,
      priority,
      department,
      studentId,
      search
    });
    return res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get complaint details by Ticket ID
 */
router.get('/:ticketId', (req, res) => {
  try {
    const complaint = storage.getComplaintById(req.params.ticketId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: `Complaint ticket ${req.params.ticketId} not found.`
      });
    }
    return res.json({
      success: true,
      complaint
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Update complaint status (Pending -> In Progress -> Completed -> Resolved)
 */
router.patch('/:ticketId/status', (req, res) => {
  try {
    const { status, noteText, authorName, authorRole } = req.body;
    const validStatuses = ["Pending", "In Progress", "Completed", "Resolved", "Cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const complaint = storage.getComplaintById(req.params.ticketId);
    if (!complaint) {
      return res.status(404).json({ success: false, error: "Ticket not found." });
    }

    const updates = { status };
    if (status === "Resolved") {
      updates.resolvedAt = new Date().toISOString();
      updates.resolvedBy = authorName || "Administrator";
    }

    const updated = storage.updateComplaint(req.params.ticketId, updates);

    // Add audit note
    if (noteText || status) {
      storage.addComplaintNote(req.params.ticketId, {
        author: authorName || "System",
        role: authorRole || "admin",
        text: noteText || `Status updated to ${status}.`
      });
    }

    // Trigger notification
    storage.createNotification({
      userId: complaint.studentId || "user-stu-1",
      targetRole: "student",
      title: `Ticket ${complaint.ticketId} Update`,
      message: `Your ticket has transitioned to "${status}". Note: ${noteText || 'Maintenance workflow updated.'}`,
      type: "status_update",
      ticketId: complaint.ticketId
    });

    return res.json({
      success: true,
      message: `Status updated to ${status}`,
      complaint: storage.getComplaintById(req.params.ticketId)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Reassign department or staff member
 */
router.patch('/:ticketId/assign', (req, res) => {
  try {
    const { assignedDepartment, assignedStaff, noteText, authorName } = req.body;
    const complaint = storage.getComplaintById(req.params.ticketId);
    if (!complaint) {
      return res.status(404).json({ success: false, error: "Ticket not found." });
    }

    const updates = {};
    if (assignedDepartment) updates.assignedDepartment = assignedDepartment;
    if (assignedStaff) updates.assignedStaff = assignedStaff;

    storage.updateComplaint(req.params.ticketId, updates);

    storage.addComplaintNote(req.params.ticketId, {
      author: authorName || "Dr. Vikram Malhotra (Admin)",
      role: "admin",
      text: noteText || `Reassigned to ${assignedDepartment || complaint.assignedDepartment} (Staff: ${assignedStaff || complaint.assignedStaff}).`
    });

    return res.json({
      success: true,
      message: "Ticket assignment updated successfully.",
      complaint: storage.getComplaintById(req.params.ticketId)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Add note to complaint
 */
router.post('/:ticketId/notes', (req, res) => {
  try {
    const { author, role, text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, error: "Note text cannot be empty." });
    }

    const updated = storage.addComplaintNote(req.params.ticketId, {
      author: author || "Staff Member",
      role: role || "staff",
      text: text.trim()
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Ticket not found." });
    }

    return res.json({
      success: true,
      complaint: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
