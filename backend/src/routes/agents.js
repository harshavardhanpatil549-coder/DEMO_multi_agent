import express from 'express';
import { coordinator } from '../coordinator/coordinator.js';
import { storage } from '../services/storage.js';
import { getGeminiStatus } from '../services/gemini.js';

const router = express.Router();

/**
 * Get comprehensive state for AI Agent Command Center
 */
router.get('/command-center', (req, res) => {
  try {
    const geminiStatus = getGeminiStatus();
    const storageMode = storage.getStorageMode();
    const allExecutions = storage.getAgentExecutions();
    const allWorkflows = coordinator.getAllWorkflows();
    const complaints = storage.getComplaints();

    // Calculate agent stats
    const agentStats = {
      "Issue Detection Agent": { totalRuns: 0, successes: 0, avgTimeMs: 0 },
      "Priority Analysis Agent": { totalRuns: 0, successes: 0, avgTimeMs: 0 },
      "Investigation Agent": { totalRuns: 0, successes: 0, avgTimeMs: 0 },
      "Action Agent": { totalRuns: 0, successes: 0, avgTimeMs: 0 }
    };

    allExecutions.forEach(exec => {
      if (agentStats[exec.agentName]) {
        agentStats[exec.agentName].totalRuns++;
        if (exec.status === "Completed") agentStats[exec.agentName].successes++;
        agentStats[exec.agentName].avgTimeMs += (exec.durationMs || 0);
      }
    });

    Object.keys(agentStats).forEach(name => {
      const s = agentStats[name];
      s.avgTimeMs = s.totalRuns > 0 ? Math.round(s.avgTimeMs / s.totalRuns) : 280;
      s.successRate = s.totalRuns > 0 ? Math.round((s.successes / s.totalRuns) * 100) : 100;
    });

    // Get latest active or completed workflow
    const latestWorkflow = allWorkflows[0] || null;

    // Define standard 4 agents metadata
    const agents = [
      {
        id: "agent-1",
        name: "Issue Detection Agent",
        role: "Categorization & Entity Extraction",
        description: "Scans raw complaint text, extracts equipment entities, technical categories, locations, and identifies missing parameters.",
        status: latestWorkflow?.agents?.["Issue Detection Agent"]?.status || "Waiting",
        lastExecution: allExecutions.find(e => e.agentName === "Issue Detection Agent") || null,
        stats: agentStats["Issue Detection Agent"]
      },
      {
        id: "agent-2",
        name: "Priority Analysis Agent",
        role: "Academic Urgency & Impact Analysis",
        description: "Assesses student count, educational disruption, deadlines (exams/presentations), and assigns validated Low/Medium/High priority.",
        status: latestWorkflow?.agents?.["Priority Analysis Agent"]?.status || "Waiting",
        lastExecution: allExecutions.find(e => e.agentName === "Priority Analysis Agent") || null,
        stats: agentStats["Priority Analysis Agent"]
      },
      {
        id: "agent-3",
        name: "Investigation Agent",
        role: "Knowledge Base & Historical DB Forensic",
        description: "Autonomously queries campus maintenance protocols, correlates historical failures in that room, and prescribes standard troubleshooting steps.",
        status: latestWorkflow?.agents?.["Investigation Agent"]?.status || "Waiting",
        lastExecution: allExecutions.find(e => e.agentName === "Investigation Agent") || null,
        stats: agentStats["Investigation Agent"]
      },
      {
        id: "agent-4",
        name: "Action Agent",
        role: "Ticket Dispatch & DB Transaction Authority",
        description: "Validates pipeline outputs, assigns responsible department & technician lead, writes ticket to database, and triggers notifications.",
        status: latestWorkflow?.agents?.["Action Agent"]?.status || "Waiting",
        lastExecution: allExecutions.find(e => e.agentName === "Action Agent") || null,
        stats: agentStats["Action Agent"]
      }
    ];

    return res.json({
      success: true,
      coordinator: {
        status: latestWorkflow ? latestWorkflow.status : "Idle",
        currentStep: latestWorkflow ? latestWorkflow.currentStep : "Ready for incoming complaints",
        totalWorkflows: allWorkflows.length,
        activeWorkflowId: latestWorkflow?.workflowId || null,
        latestTicketId: latestWorkflow?.ticketId || null,
        uptime: process.uptime(),
        aiProvider: geminiStatus,
        storageProvider: storageMode
      },
      agents,
      latestWorkflow,
      recentExecutions: allExecutions.slice(0, 15)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Poll or fetch specific workflow status (for real-time frontend animation)
 */
router.get('/workflows/:workflowId', (req, res) => {
  try {
    const wf = coordinator.getWorkflowStatus(req.params.workflowId);
    if (!wf) {
      return res.status(404).json({ success: false, error: "Workflow not found." });
    }
    return res.json({ success: true, workflow: wf });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get all agent execution logs
 */
router.get('/executions', (req, res) => {
  try {
    const { ticketId, agentName, workflowId } = req.query;
    const logs = storage.getAgentExecutions({ ticketId, agentName, workflowId });
    return res.json({
      success: true,
      count: logs.length,
      executions: logs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Pre-built Demonstration Scenarios for Judges
 */
const DEMO_SCENARIOS = {
  "official": {
    title: "Projector not working in Classroom 204",
    description: "The projector in classroom 204 is not working and we have a presentation tomorrow.",
    building: "Academic Block A",
    room: "Classroom 204",
    studentName: "Aarav Sharma",
    studentId: "STU-2026-1049"
  },
  "water-leak": {
    title: "Massive water pipe burst in Science Block",
    description: "High pressure water pipe burst in the 3rd floor washroom. Water is leaking onto the corridor floor and near electric switchboards.",
    building: "Science Block",
    room: "3rd Floor Washroom C",
    studentName: "Priya Patel",
    studentId: "STU-2026-1182"
  },
  "fan-sparks": {
    title: "Ceiling fan regulator sparking and smoking",
    description: "The ceiling fan regulator knob in Study Hall 3 is throwing sparks when turned and giving off a distinct burning wire smell.",
    building: "Central Library",
    room: "Study Hall 3 (Level 2)",
    studentName: "Rohan Verma",
    studentId: "STU-2026-1304"
  },
  "ac-failure": {
    title: "Server Room / Lab AC completely shut down",
    description: "The split air conditioner in Computer Science Lab 4 has stopped cooling and is displaying error E4 on the digital panel.",
    building: "Turing Computing Complex",
    room: "Lab 402",
    studentName: "Neha Saxena",
    studentId: "STU-2026-1450"
  },
  "minor-desk": {
    title: "Wobbly chair in seminar hall",
    description: "Chair in row 4 seat 8 has a slightly wobbly leg. It is still usable but creaks slightly during conferences.",
    building: "Main Auditorium",
    room: "Seminar Hall B",
    studentName: "Kavita Reddy",
    studentId: "STU-2026-1502"
  }
};

router.post('/trigger-demo', async (req, res) => {
  try {
    const scenarioKey = req.body.scenario || "official";
    const scenarioData = DEMO_SCENARIOS[scenarioKey] || DEMO_SCENARIOS["official"];

    console.log(`[Coordinator] Triggering Hackathon Demonstration Scenario: "${scenarioKey}"`);
    const workflowResult = await coordinator.startWorkflow({
      ...scenarioData,
      forceNew: req.body.forceNew ?? true // Demo trigger explicitly intends to demonstrate the workflow
    });

    if (workflowResult.isDuplicate) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        scenario: scenarioKey,
        ticketId: workflowResult.existingTicketId,
        ticket: workflowResult.ticket,
        message: workflowResult.message
      });
    }

    // If client requested async polling
    if (req.query.async === 'true') {
      return res.status(202).json({
        success: true,
        scenario: scenarioKey,
        workflowId: workflowResult.workflowId,
        status: "Running"
      });
    }

    const finalWorkflow = await workflowResult.executionPromise;
    const createdTicket = storage.getComplaintById(finalWorkflow.ticketId);

    return res.status(201).json({
      success: true,
      scenario: scenarioKey,
      workflowId: finalWorkflow.workflowId,
      ticketId: finalWorkflow.ticketId,
      ticket: createdTicket,
      workflow: finalWorkflow
    });
  } catch (err) {
    console.error("[AgentsRoute] Demo execution error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
