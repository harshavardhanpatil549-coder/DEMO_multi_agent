import { runAgentPrompt } from '../services/gemini.js';

const SYSTEM_INSTRUCTION = `You are the Issue Detection Agent for CampusFix AI, an autonomous campus maintenance system.
Your job is to read student maintenance complaints, analyze them with high precision, and extract structured technical details.
Responsibilities:
1. Identify the accurate issue category (e.g. Equipment Failure, Electrical Failure, Plumbing Failure, HVAC / Climate Control, IT & Network Systems, Civil & Infrastructure, Safety Hazard).
2. Extract the specific problem/issue.
3. Identify the affected equipment or facility.
4. Identify the precise campus location (building, room, floor).
5. Generate a concise technical summary.
6. Note any missing information that technicians might need (e.g. error lights, exact fixture ID, serial number).
7. Suggest the primary responsible campus department.

Output Schema (pure JSON):
{
  "category": "string",
  "issue": "string",
  "equipment": "string",
  "location": "string",
  "summary": "string",
  "missing_info": "string",
  "recommended_department": "string",
  "confidence_score": number (0.0 to 1.0)
}`;

export async function runIssueDetectionAgent({ title, description, building, room }) {
  const fullLocation = [building, room].filter(Boolean).join(', ') || 'Campus Grounds';
  const prompt = `Student Complaint Data:
Title: "${title}"
Description: "${description}"
Building: "${building || 'Not specified'}"
Room: "${room || 'Not specified'}"

Analyze this issue and output the structured JSON according to your instructions.`;

  const fallbackGenerator = () => {
    const text = (title + ' ' + description).toLowerCase();
    
    let category = "Equipment Failure";
    let department = "AV Maintenance";
    let equipment = "Classroom Equipment";
    let issue = title;
    let missing_info = "Specific model number or error code not provided";

    if (text.includes('projector') || text.includes('screen') || text.includes('mic') || text.includes('speaker') || text.includes('hdmi') || text.includes('podium') || text.includes('display')) {
      category = "Equipment Failure";
      department = "AV Maintenance";
      equipment = text.includes('projector') ? "Ceiling Mounted Projector" : "AV Audio/Visual System";
      issue = "Projector/display hardware or connectivity malfunction";
    } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('tap') || text.includes('flush') || text.includes('toilet') || text.includes('washroom') || text.includes('drain')) {
      category = "Plumbing Failure";
      department = "Plumbing & Water Systems";
      equipment = text.includes('pipe') ? "Water Supply Pipeline" : (text.includes('flush') ? "Dual-Flush Restroom Valve" : "Sanitary Water Fixture");
      issue = "Active water leakage or plumbing failure";
      missing_info = "Isolation valve position or water flow rate not specified";
    } else if (text.includes('light') || text.includes('fan') || text.includes('spark') || text.includes('shock') || text.includes('breaker') || text.includes('power') || text.includes('socket') || text.includes('switch')) {
      category = "Electrical Failure";
      department = "Electrical Maintenance";
      equipment = text.includes('fan') ? "Ceiling Fan & Regulator" : (text.includes('light') ? "LED Panel / Tube Fixture" : "Wall Power Switchboard");
      issue = "Electrical power delivery or fixture fault";
      missing_info = "MCB trip status or burning odor presence not confirmed";
    } else if (text.includes('ac') || text.includes('air condition') || text.includes('cooling') || text.includes('cold') || text.includes('vent') || text.includes('heat') || text.includes('thermostat')) {
      category = "HVAC / Climate Control";
      department = "HVAC & Climate Control";
      equipment = "Split AC / Central Blower Unit";
      issue = "Inadequate cooling or air conditioning breakdown";
      missing_info = "Remote thermostat setting or blower fan status not stated";
    } else if (text.includes('wifi') || text.includes('internet') || text.includes('network') || text.includes('lan') || text.includes('ethernet') || text.includes('router') || text.includes('portal')) {
      category = "IT & Network Systems";
      department = "IT & Campus Network";
      equipment = "Campus Wi-Fi Access Point / Ethernet Port";
      issue = "Wireless network connectivity or IP assignment disruption";
      missing_info = "MAC address or device OS not specified";
    } else if (text.includes('chair') || text.includes('bench') || text.includes('desk') || text.includes('door') || text.includes('window') || text.includes('glass') || text.includes('tile') || text.includes('lock')) {
      category = "Civil & Infrastructure";
      department = "Civil & Infrastructure";
      equipment = text.includes('chair') ? "Tiered Lecture Hall Seating" : (text.includes('door') ? "Door Hinge & Handle" : "Classroom Furniture");
      issue = "Damaged physical infrastructure or furniture";
      missing_info = "Exact seat row or hinge damage type not specified";
    }

    return {
      category,
      issue,
      equipment,
      location: fullLocation,
      summary: `${issue} in ${fullLocation}`,
      missing_info,
      recommended_department: department,
      confidence_score: 0.95
    };
  };

  return runAgentPrompt({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt,
    expectedSchema: "JSON",
    fallbackGenerator
  });
}
