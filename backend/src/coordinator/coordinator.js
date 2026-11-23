import { v4 as uuidv4 } from 'uuid';
import { runIssueDetectionAgent } from '../agents/agent1-issue-detection.js';
import { runPriorityAnalysisAgent } from '../agents/agent2-priority-analysis.js';
import { runInvestigationAgent } from '../agents/agent3-investigation.js';
import { runActionAgent } from '../agents/agent4-action.js';
import { storage } from '../services/storage.js';

class CentralAICoordinator {
  constructor() {
    this.activeWorkflows = new Map();
  }

  /**
   * Validates submitted complaint data
   */
  validateComplaintInput(input) {
    const errors = [];
    if (!input.title || input.title.trim().length < 5) {
      errors.push("Complaint title must be at least 5 characters long.");
    }
    if (!input.description || input.description.trim().length < 10) {
      errors.push("Complaint description must be at least 10 characters long.");
    }
    if (!input.building || input.building.trim().length === 0) {
      errors.push("Building name is required.");
    }
    if (!input.room || input.room.trim().length === 0) {
      errors.push("Room or specific location is required.");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check for duplicate complaints submitted recently (within last 30 minutes in same room with similar title)
   */
  checkForDuplicates(input) {
    const complaints = storage.getComplaints();
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;

    const existing = complaints.find(c => {
      const isSameRoom = c.room && c.room.toLowerCase() === input.room.toLowerCase();
      const isSameBuilding = c.building && c.building.toLowerCase() === input.building.toLowerCase();
      const isRecent = new Date(c.createdAt).getTime() > thirtyMinutesAgo;
      const isSimilarTitle = c.title.toLowerCase().includes(input.title.toLowerCase().slice(0, 10)) ||
                             input.title.toLowerCase().includes(c.title.toLowerCase().slice(0, 10));
      return isSameRoom && isSameBuilding && isRecent && isSimilarTitle;
    });

    return existing || null;
  }

  /**
   * Helper to execute an individual agent step with retries, status logging and timing
   */
  async executeAgentWithRetry({ workflowId, agentName, runFn, maxRetries = 2 }) {
    let attempt = 0;
    let lastError = null;
    const executionId = `exec-${Date.now()}-${agentName.toLowerCase().replace(/\s+/g, '-')}`;

    while (attempt <= maxRetries) {
      attempt++;
      const startTime = Date.now();
      const startedAt = new Date().toISOString();

      try {
        console.log(`[Coordinator] [${workflowId}] Starting ${agentName} (Attempt ${attempt}/${maxRetries + 1})...`);

        // Record in workflow state
        this.updateWorkflowAgentState(workflowId, agentName, {
          status: attempt > 1 ? "Retrying" : "Processing",
          attempt,
          startedAt
        });

        // Run the agent
        const result = await runFn();
        const durationMs = Date.now() - startTime;
        const completedAt = new Date().toISOString();

        // Validate agent output
        if (!result || !result.data) {
          throw new Error(`${agentName} produced empty or malformed result.`);
        }

        // Log execution to storage
        const executionRecord = {
          executionId,
          workflowId,
          agentName,
          status: "Completed",
          input: result.prompt || "Input passed from previous pipeline stage",
          output: result.data,
          source: result.source || "Google Gemini AI",
          durationMs,
          startedAt,
          completedAt,
          attempt,
          errorMessage: null
        };
        storage.logAgentExecution(executionRecord);

        // Update in-memory workflow state
        this.updateWorkflowAgentState(workflowId, agentName, {
          status: "Completed",
          output: result.data,
          source: result.source,
          durationMs,
          completedAt
        });

        console.log(`[Coordinator] [${workflowId}] ${agentName} Completed successfully in ${durationMs}ms.`);
        return result.data;
      } catch (err) {
        lastError = err;
        const durationMs = Date.now() - startTime;
        console.warn(`[Coordinator] [${workflowId}] ${agentName} attempt ${attempt} failed: ${err.message}`);

        if (attempt <= maxRetries) {
          // Wait briefly before retry
          await new Promise(r => setTimeout(r, 400));
        } else {
          // Final failure
          const failedAt = new Date().toISOString();
          const executionRecord = {
            executionId,
            workflowId,
            agentName,
            status: "Failed",
            input: "Execution inputs",
            output: null,
            durationMs,
            startedAt,
            completedAt: failedAt,
            attempt,
            errorMessage: err.message
          };
          storage.logAgentExecution(executionRecord);

          this.updateWorkflowAgentState(workflowId, agentName, {
            status: "Failed",
            errorMessage: err.message,
            durationMs,
            completedAt: failedAt
          });
          throw err;
        }
      }
    }

    throw lastError;
  }

  updateWorkflowAgentState(workflowId, agentName, agentUpdates) {
    const wf = this.activeWorkflows.get(workflowId);
    if (!wf) return;

    wf.agents[agentName] = {
      ...(wf.agents[agentName] || {}),
      ...agentUpdates
    };
    wf.updatedAt = new Date().toISOString();

    // Persist to storage
    storage.saveWorkflowLog({
      workflowId: wf.workflowId,
      ticketId: wf.ticketId || null,
      coordinatorStatus: wf.status,
      currentStep: wf.currentStep,
      agents: wf.agents,
      complaint: {
        title: wf.complaint.title,
        building: wf.complaint.building,
        room: wf.complaint.room,
        studentName: wf.complaint.studentName
      },
      createdAt: wf.createdAt,
      completedAt: wf.completedAt || null,
      errorMessage: wf.errorMessage || null
    });
  }

  /**
   * Main entrypoint: Initiates autonomous multi-agent coordination workflow
   */
  async startWorkflow(complaintInput) {
    // Step 1: Validate input
    const validation = this.validateComplaintInput(complaintInput);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(' ')}`);
    }

    // Step 2: Duplicate check (unless forceNew is explicitly true for demonstration executions)
    if (!complaintInput.forceNew) {
      const duplicate = this.checkForDuplicates(complaintInput);
      if (duplicate) {
        return {
          isDuplicate: true,
          existingTicketId: duplicate.ticketId,
          message: `A similar complaint was recently submitted for ${complaintInput.building} ${complaintInput.room}. Tracking existing ticket ${duplicate.ticketId}.`,
          ticket: duplicate
        };
      }
    }

    // Step 3: Initialize Workflow Record
    const workflowId = `wf-${Date.now()}-${uuidv4().slice(0, 8)}`;
    const initialWorkflow = {
      workflowId,
      status: "Running",
      currentStep: "Central Coordinator Initialized",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      complaint: complaintInput,
      agents: {
        "Issue Detection Agent": { status: "Waiting", role: "Extracts technical category, equipment, and location" },
        "Priority Analysis Agent": { status: "Waiting", role: "Evaluates academic urgency and student impact" },
        "Investigation Agent": { status: "Waiting", role: "Searches knowledge base & previous complaints database" },
        "Action Agent": { status: "Waiting", role: "Generates official ticket, validates DB write, and dispatches" }
      },
      results: {},
      ticketId: null,
      errorMessage: null
    };

    this.activeWorkflows.set(workflowId, initialWorkflow);
    storage.saveWorkflowLog(initialWorkflow);

    // Run the pipeline asynchronously so caller gets immediate response or can await it
    const executionPromise = (async () => {
      try {
        // --- STEP 1: Issue Detection Agent ---
        initialWorkflow.currentStep = "Agent 1: Issue Detection in Progress";
        const detectionResult = await this.executeAgentWithRetry({
          workflowId,
          agentName: "Issue Detection Agent",
          runFn: () => runIssueDetectionAgent(complaintInput)
        });
        initialWorkflow.results.detection = detectionResult;

        // --- STEP 2: Priority Analysis Agent ---
        initialWorkflow.currentStep = "Agent 2: Priority & Academic Urgency Analysis in Progress";
        const priorityResult = await this.executeAgentWithRetry({
          workflowId,
          agentName: "Priority Analysis Agent",
          runFn: () => runPriorityAnalysisAgent({
            detectionOutput: detectionResult,
            originalComplaint: complaintInput
          })
        });
        initialWorkflow.results.priority = priorityResult;

        // --- STEP 3: Investigation Agent ---
        initialWorkflow.currentStep = "Agent 3: Historical Records & Knowledge Base Investigation in Progress";
        const investigationResult = await this.executeAgentWithRetry({
          workflowId,
          agentName: "Investigation Agent",
          runFn: () => runInvestigationAgent({
            detectionOutput: detectionResult,
            priorityOutput: priorityResult,
            originalComplaint: complaintInput
          })
        });
        initialWorkflow.results.investigation = investigationResult;

        // --- STEP 4: Action Agent ---
        initialWorkflow.currentStep = "Agent 4: Action Agent Finalizing Ticket Creation & Database Dispatch";
        const actionResult = await this.executeAgentWithRetry({
          workflowId,
          agentName: "Action Agent",
          runFn: () => runActionAgent({
            workflowId,
            originalComplaint: complaintInput,
            detectionOutput: detectionResult,
            priorityOutput: priorityResult,
            investigationOutput: investigationResult
          })
        });
        initialWorkflow.results.action = actionResult;

        // --- FINAL COORDINATOR CONCLUSION ---
        initialWorkflow.status = "Completed";
        initialWorkflow.currentStep = "Workflow Completed Successfully";
        initialWorkflow.ticketId = actionResult.ticket_id;
        initialWorkflow.completedAt = new Date().toISOString();
        
        storage.saveWorkflowLog(initialWorkflow);
        console.log(`[Coordinator] [${workflowId}] Workflow finished! Ticket ${actionResult.ticket_id} created.`);
        return initialWorkflow;
      } catch (err) {
        initialWorkflow.status = "Failed";
        initialWorkflow.errorMessage = err.message;
        initialWorkflow.currentStep = `Failed at step: ${initialWorkflow.currentStep}`;
        initialWorkflow.completedAt = new Date().toISOString();
        storage.saveWorkflowLog(initialWorkflow);
        console.error(`[Coordinator] [${workflowId}] Workflow encountered critical error:`, err);
        throw err;
      }
    })();

    return {
      workflowId,
      status: "Running",
      executionPromise,
      initialWorkflow
    };
  }

  getWorkflowStatus(workflowId) {
    if (this.activeWorkflows.has(workflowId)) {
      return this.activeWorkflows.get(workflowId);
    }
    // Check disk storage
    return storage.getWorkflowLog(workflowId) || null;
  }

  getAllWorkflows() {
    return storage.getAllWorkflowLogs();
  }
}

export const coordinator = new CentralAICoordinator();
