import { runAgentPrompt } from '../services/gemini.js';
import { storage } from '../services/storage.js';

const SYSTEM_INSTRUCTION = `You are the Action Agent for CampusFix AI.
You are the execution and dispatch authority in the autonomous multi-agent pipeline.
Your responsibilities:
1. Receive and rigorously validate findings from:
   - Agent 1: Issue Detection Agent
   - Agent 2: Priority Analysis Agent
   - Agent 3: Investigation Agent
2. Synthesize an operational action summary for staff and students.
3. Validate department assignment and identify the appropriate duty lead.
4. Finalize ticket creation parameters.

Output Schema (pure JSON):
{
  "ticket_validated": boolean,
  "assigned_department": "string",
  "priority": "Low" | "Medium" | "High",
  "recommended_lead_role": "string",
  "action_summary": "string",
  "dispatch_urgency": "Immediate" | "Standard" | "Scheduled"
}`;

export async function runActionAgent({ 
  workflowId, 
  originalComplaint, 
  detectionOutput, 
  priorityOutput, 
  investigationOutput 
}) {
  const prompt = `Synthesize multi-agent findings for final ticket generation:

Agent 1 (Issue Detection):
- Category: ${detectionOutput.category}
- Equipment: ${detectionOutput.equipment}
- Location: ${detectionOutput.location}
- Summary: ${detectionOutput.summary}

Agent 2 (Priority Analysis):
- Priority: ${priorityOutput.priority} (Urgency: ${priorityOutput.urgency_score}/10)
- Reasoning: ${priorityOutput.reason}
- Response Time: ${priorityOutput.recommended_response}

Agent 3 (Investigation):
- Prior Record Match: ${investigationOutput.previous_similar_issue ? 'Yes' : 'No'}
- Protocol: ${investigationOutput.knowledge_base_protocol}
- Department: ${investigationOutput.recommended_department}
- Suggested Action: ${investigationOutput.suggested_action}

Generate final dispatch parameters conforming to JSON schema.`;

  const fallbackGenerator = () => {
    const department = investigationOutput.recommended_department || detectionOutput.recommended_department || "AV Maintenance";
    const priority = priorityOutput.priority || "Medium";
    
    let dispatchUrgency = "Standard";
    if (priority === "High") dispatchUrgency = "Immediate";
    if (priority === "Low") dispatchUrgency = "Scheduled";

    return {
      ticket_validated: true,
      assigned_department: department,
      priority: priority,
      recommended_lead_role: `${department} Duty Specialist`,
      action_summary: `Autonomous maintenance ticket validated. Categorized as ${detectionOutput.category} (${priority} Priority). Assigned to ${department} with protocol "${investigationOutput.knowledge_base_protocol}". ${investigationOutput.suggested_action}`,
      dispatch_urgency: dispatchUrgency
    };
  };

  const aiResult = await runAgentPrompt({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt,
    expectedSchema: "JSON",
    fallbackGenerator
  });

  // CRITICAL REQUIREMENT:
  // "Only report successful creation after confirming that the database operation succeeded."
  const nextTicketId = storage.generateNextTicketId();

  // Find department lead staff member from storage
  const departments = storage.getDepartments();
  const matchedDept = departments.find(d => d.name.toLowerCase() === aiResult.data.assigned_department.toLowerCase()) || departments[0];
  const assignedStaff = matchedDept.staff?.[0] || matchedDept.lead || "Unassigned";

  // Build the complete complaint record
  const newComplaintRecord = {
    ticketId: nextTicketId,
    studentName: originalComplaint.studentName || "Anonymous Student",
    studentId: originalComplaint.studentId || "STU-2026-GEN",
    title: originalComplaint.title,
    description: originalComplaint.description,
    building: originalComplaint.building || "Campus",
    room: originalComplaint.room || "General Area",
    location: detectionOutput.location || `${originalComplaint.building}, ${originalComplaint.room}`,
    category: detectionOutput.category,
    equipment: detectionOutput.equipment,
    priority: priorityOutput.priority,
    priorityReason: priorityOutput.reason,
    urgencyScore: priorityOutput.urgency_score,
    assignedDepartment: aiResult.data.assigned_department,
    assignedStaff: assignedStaff,
    investigationSummary: investigationOutput.investigation_summary,
    suggestedAction: investigationOutput.suggested_action,
    protocolApplied: investigationOutput.knowledge_base_protocol,
    recommendedTools: investigationOutput.recommended_tools_or_parts,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    workflowId: workflowId,
    image: originalComplaint.image || null,
    aiAnalysis: {
      detection: detectionOutput,
      priority: priorityOutput,
      investigation: investigationOutput,
      action: aiResult.data,
      source: aiResult.source
    },
    notes: [
      {
        author: "CampusFix AI Central Coordinator",
        role: "system",
        text: `Ticket autonomously created by Action Agent. Dispatched to ${aiResult.data.assigned_department} (Assigned Staff: ${assignedStaff}). Priority: ${priorityOutput.priority}. Reason: ${priorityOutput.reason}`,
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Perform database write
  const savedRecord = storage.createComplaint(newComplaintRecord);
  const writeSucceeded = Boolean(savedRecord && savedRecord.ticketId === nextTicketId);

  if (!writeSucceeded) {
    throw new Error("Database transaction failed during ticket creation in storage engine.");
  }

  // Create In-App Notification for student
  storage.createNotification({
    userId: originalComplaint.userId || "user-stu-1",
    targetRole: "student",
    title: `Ticket ${nextTicketId} Created!`,
    message: `Your complaint "${originalComplaint.title}" was analyzed and routed to ${aiResult.data.assigned_department} (${priorityOutput.priority} Priority).`,
    type: "ticket_created",
    ticketId: nextTicketId
  });

  // If High Priority, notify administrators
  if (priorityOutput.priority === "High") {
    storage.createNotification({
      userId: "user-admin-1",
      targetRole: "admin",
      title: `High Priority Alert: ${nextTicketId}`,
      message: `Urgent issue detected: "${originalComplaint.title}" at ${newComplaintRecord.location}. Immediate response dispatched.`,
      type: "high_priority",
      ticketId: nextTicketId
    });
  }

  return {
    ...aiResult,
    data: {
      ...aiResult.data,
      ticket_created: true,
      ticket_id: nextTicketId,
      department: aiResult.data.assigned_department,
      assigned_staff: assignedStaff,
      status: "Pending",
      db_write_confirmed: true
    }
  };
}
