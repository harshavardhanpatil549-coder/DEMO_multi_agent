import { runAgentPrompt } from '../services/gemini.js';

const SYSTEM_INSTRUCTION = `You are the Priority Analysis Agent for CampusFix AI.
Your responsibility is to analyze the urgency and academic impact of campus maintenance complaints.
You must:
1. Objectively evaluate the urgency (time-sensitivity).
2. Assess direct student and faculty impact.
3. Estimate the number of affected individuals.
4. Gauge educational disruption (scheduled classes, upcoming presentations, exams, lab safety).
5. Assign priority strictly as: "Low", "Medium", or "High".
CRITICAL RULE: DO NOT classify every complaint as "High".
- "High": Imminent safety hazard (sparks, active pipe flooding), or critical academic disruption scheduled within 24 hours (exam hall, tomorrow's presentation, blocked main exit).
- "Medium": Non-hazardous operational failure affecting an active group (e.g., standard classroom projector for normal daily classes, 1 of 4 washroom stalls out of order, noisy AC).
- "Low": Cosmetic or minor inconvenience with minimal disruption (e.g., creaky door hinge, minor paint peeling, single flickery ambient bulb in hallway, routine desk scratch).

Output Schema (pure JSON):
{
  "priority": "Low" | "Medium" | "High",
  "urgency_score": number (1 to 10),
  "reason": "string",
  "impact": "string",
  "affected_people_estimate": "string",
  "educational_disruption": "string",
  "recommended_response": "string"
}`;

export async function runPriorityAnalysisAgent({ detectionOutput, originalComplaint }) {
  const prompt = `Issue Detection Agent Findings:
Category: ${detectionOutput.category}
Issue: ${detectionOutput.issue}
Equipment: ${detectionOutput.equipment}
Location: ${detectionOutput.location}
Department: ${detectionOutput.recommended_department}

Student Original Statement:
Title: "${originalComplaint.title}"
Description: "${originalComplaint.description}"

Analyze the urgency and educational impact. Return strict JSON.`;

  const fallbackGenerator = () => {
    const text = (originalComplaint.title + ' ' + originalComplaint.description).toLowerCase();
    
    // High priority triggers
    const isEmergencySafety = text.includes('spark') || text.includes('fire') || text.includes('shock') || text.includes('flooding') || text.includes('burst') || text.includes('smoke');
    const isImminentDeadline = text.includes('tomorrow') || text.includes('presentation') || text.includes('exam') || text.includes('viva') || text.includes('urgent') || text.includes('immediately');
    
    // Low priority triggers
    const isMinor = text.includes('scratch') || text.includes('creak') || text.includes('cosmetic') || text.includes('slight') || text.includes('minor') || text.includes('paint') || text.includes('loose handle');

    if (isEmergencySafety) {
      return {
        priority: "High",
        urgency_score: 9,
        reason: "Immediate safety hazard or structural damage potential detected (water leak/sparking risk).",
        impact: "Severe risk of physical damage and hazard to occupants in the area.",
        affected_people_estimate: "Entire wing / 50+ students & staff",
        educational_disruption: "Classroom or facility evacuation / safety hazard",
        recommended_response: "Immediate dispatch within 1 hour."
      };
    } else if (isImminentDeadline) {
      return {
        priority: "High",
        urgency_score: 8,
        reason: "The affected equipment is required for an upcoming academic presentation or examination tomorrow.",
        impact: "Direct academic disruption to students facing immediate evaluation deadlines.",
        affected_people_estimate: "30-50 students in classroom session",
        educational_disruption: "Scheduled academic presentation or instructional session blocked",
        recommended_response: "Prompt inspection and resolution within 2-4 hours prior to scheduled presentation."
      };
    } else if (isMinor) {
      return {
        priority: "Low",
        urgency_score: 3,
        reason: "Minor inconvenience or cosmetic maintenance issue with minimal instructional impact.",
        impact: "Negligible operational impact; alternative equipment or seating remains readily accessible.",
        affected_people_estimate: "1-5 students",
        educational_disruption: "Zero educational disruption to ongoing curricula",
        recommended_response: "Schedule during routine weekly maintenance cycle (within 48 hours)."
      };
    } else {
      // Default Medium
      return {
        priority: "Medium",
        urgency_score: 6,
        reason: "Routine equipment or utility malfunction impacting day-to-day campus comfort and standard workflow.",
        impact: "Noticeable inconvenience during active hours, though non-hazardous.",
        affected_people_estimate: "15-25 students",
        educational_disruption: "Moderate inconvenience; workaround or adjacent facility available",
        recommended_response: "Standard queue resolution within 6-12 hours."
      };
    }
  };

  return runAgentPrompt({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt,
    expectedSchema: "JSON",
    fallbackGenerator
  });
}
