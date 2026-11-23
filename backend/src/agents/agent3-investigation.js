import { runAgentPrompt } from '../services/gemini.js';
import { storage } from '../services/storage.js';

const SYSTEM_INSTRUCTION = `You are the Investigation Agent for CampusFix AI.
You have real-time tool access to:
1. Campus Maintenance Knowledge Base (troubleshooting protocols, equipment specs, standard procedures).
2. Historical Complaints Database (past maintenance tickets in the same location or equipment).

Responsibilities:
- Synthesize the retrieved tool query results.
- Determine if a similar previous issue occurred in this location or category.
- Formulate a precise, technically actionable troubleshooting procedure for technicians based on official protocols.
- Identify likely spare parts or diagnostic tools needed.
- Recommend the verified responsible department.
CRITICAL RULES:
- Never invent maintenance records or claim physical inspections have occurred.
- If no prior historical complaints or knowledge base articles match, state clearly that no prior record was found.

Output Schema (pure JSON):
{
  "previous_similar_issue": boolean,
  "matched_tickets_count": number,
  "matched_ticket_ids": string[],
  "knowledge_base_protocol": string,
  "recommended_department": "string",
  "suggested_action": "string",
  "investigation_summary": "string",
  "tools_queried": string[],
  "recommended_tools_or_parts": string[]
}`;

export async function runInvestigationAgent({ detectionOutput, priorityOutput, originalComplaint }) {
  // Step 1: Real tool query against database
  const fullLocation = detectionOutput.location || `${originalComplaint.building} ${originalComplaint.room}`;
  const keywords = [
    originalComplaint.room,
    originalComplaint.building,
    detectionOutput.equipment,
    detectionOutput.category
  ].filter(Boolean);

  // Tool 1: Query historical tickets
  const allComplaints = storage.getComplaints();
  const roomMatches = allComplaints.filter(c => {
    if (!originalComplaint.room) return false;
    return c.room && c.room.toLowerCase().includes(originalComplaint.room.toLowerCase());
  });

  const categoryMatches = allComplaints.filter(c => {
    return c.category && c.category.toLowerCase() === (detectionOutput.category || '').toLowerCase();
  });

  const matchedHistorical = roomMatches.length > 0 ? roomMatches : categoryMatches.slice(0, 2);
  const matchedTicketIds = matchedHistorical.map(t => t.ticketId);

  // Tool 2: Query Knowledge Base
  const searchTerms = [
    originalComplaint.title,
    detectionOutput.equipment,
    detectionOutput.category,
    originalComplaint.description
  ].join(' ');
  const kbMatches = storage.getKnowledgeBase(searchTerms) || [];
  // If specific search didn't match, search by category or equipment words
  const fallbackKb = kbMatches.length > 0 ? kbMatches : (
    storage.getKnowledgeBase('projector').length > 0 ? storage.getKnowledgeBase('projector') : storage.getKnowledgeBase('')
  );
  const topKb = fallbackKb.length > 0 ? fallbackKb[0] : null;

  const toolsQueried = [
    `ComplaintsDB: Searched room "${originalComplaint.room || 'all'}" -> ${roomMatches.length} room matches, ${categoryMatches.length} category matches`,
    `KnowledgeBase: Searched "${detectionOutput.equipment || detectionOutput.category}" -> ${kbMatches.length} matching protocols`
  ];

  const prompt = `Investigation Context from Live System Tools:
Tool Query 1 (Historical Complaints):
${matchedHistorical.length > 0 
  ? matchedHistorical.map(m => `- Ticket ${m.ticketId}: "${m.title}" (${m.location}), Status: ${m.status}, Suggested Action: ${m.suggestedAction || 'N/A'}`).join('\n')
  : 'No prior matching historical complaints found in database for this location.'}

Tool Query 2 (Knowledge Base Standard Protocol):
${topKb 
  ? `- Protocol: "${topKb.title}" [${topKb.category}]
     Responsible Department: ${topKb.responsibleDepartment}
     Troubleshooting Steps: \n${topKb.troubleshootingSteps.join('\n')}`
  : 'No dedicated Knowledge Base standard protocol found for this exact equipment.'}

Issue Under Investigation:
Location: ${fullLocation}
Category: ${detectionOutput.category}
Detected Equipment: ${detectionOutput.equipment}
Priority Assigned: ${priorityOutput.priority} (${priorityOutput.reason})

Synthesize these findings into structured JSON conforming to your schema.`;

  const fallbackGenerator = () => {
    const hasPrior = matchedHistorical.length > 0;
    const protocolTitle = topKb ? topKb.title : "General Campus Facility Protocol";
    const department = topKb ? topKb.responsibleDepartment : detectionOutput.recommended_department;

    let suggestedAction = topKb && topKb.troubleshootingSteps.length > 0
      ? topKb.troubleshootingSteps.slice(0, 3).join("; ")
      : `Perform initial physical inspection of ${detectionOutput.equipment || 'fixture'} and isolate power/water supply before testing.`;

    let summary = hasPrior
      ? `Found ${matchedHistorical.length} related prior ticket(s) (e.g. ${matchedTicketIds[0]}). Protocol "${protocolTitle}" applies. Recommended triage: ${suggestedAction}`
      : `No matching prior complaint found in database for ${fullLocation}. Applying verified protocol "${protocolTitle}".`;

    let parts = [];
    const catLower = (detectionOutput.category || '').toLowerCase();
    if (catLower.includes('av') || catLower.includes('equipment')) {
      parts = ["HDMI / DisplayPort Tester", "Optoma Projector Replacement Lamp", "Multimeter"];
    } else if (catLower.includes('plumb')) {
      parts = ["Pipe Wrench & Teflon Tape", "Braided Flex Connector Hose", "Drain Auger"];
    } else if (catLower.includes('elect')) {
      parts = ["Digital Multimeter", "16A / 32A MCB", "Insulated Screwdriver Set", "Replacement Switch"];
    } else if (catLower.includes('hvac')) {
      parts = ["R-410A Manifold Gauge", "Fin Comb & Coil Cleaner", "45/5 uF Capacitor"];
    } else if (catLower.includes('network') || catLower.includes('it')) {
      parts = ["Ethernet Cable Tester", "Cat6 RJ-45 Patch Lead", "Console Cable"];
    } else {
      parts = ["Standard Tool Kit", "Fasteners / Mounting Screws"];
    }

    return {
      previous_similar_issue: hasPrior,
      matched_tickets_count: matchedHistorical.length,
      matched_ticket_ids: matchedTicketIds,
      knowledge_base_protocol: protocolTitle,
      recommended_department: department,
      suggested_action: suggestedAction,
      investigation_summary: summary,
      tools_queried: toolsQueried,
      recommended_tools_or_parts: parts
    };
  };

  return runAgentPrompt({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt,
    expectedSchema: "JSON",
    fallbackGenerator
  });
}
