import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data for the campus
const SEED_DATA = {
  departments: [
    {
      id: "dept-av",
      name: "AV Maintenance",
      description: "Smart classroom displays, laser projectors, microphones, sound systems, and video conference equipment",
      lead: "Rajesh Kumar",
      contact: "av-support@campus.edu",
      slaHours: 4,
      staff: ["Rajesh Kumar", "Amit Sinha"]
    },
    {
      id: "dept-elec",
      name: "Electrical Maintenance",
      description: "Classroom lighting, ceiling fans, power sockets, switchboards, UPS backups, and master panel boards",
      lead: "Suresh Verma",
      contact: "electrical@campus.edu",
      slaHours: 2,
      staff: ["Suresh Verma", "Mahesh Das"]
    },
    {
      id: "dept-plumb",
      name: "Plumbing & Water Systems",
      description: "Restroom fixtures, water taps, flush tanks, RO drinking water stations, drainage pipes, and overhead tanks",
      lead: "Anil Joshi",
      contact: "plumbing@campus.edu",
      slaHours: 3,
      staff: ["Anil Joshi", "Ramesh Rao"]
    },
    {
      id: "dept-hvac",
      name: "HVAC & Climate Control",
      description: "Central air conditioning, split AC units, ventilation ducts, chilled water lines, and thermostat sensors",
      lead: "Kavita Reddy",
      contact: "hvac@campus.edu",
      slaHours: 6,
      staff: ["Kavita Reddy", "Prakash N"]
    },
    {
      id: "dept-civil",
      name: "Civil & Infrastructure",
      description: "Broken chairs, study desks, door locks, window glass panes, ceiling tiles, whitewash, and floor repairs",
      lead: "Manoj Patil",
      contact: "civil@campus.edu",
      slaHours: 12,
      staff: ["Manoj Patil", "Devendra K"]
    },
    {
      id: "dept-it",
      name: "IT & Campus Network",
      description: "Wi-Fi access points, optical fiber links, ethernet ports, server racks, and classroom podium PCs",
      lead: "Neha Saxena",
      contact: "noc@campus.edu",
      slaHours: 2,
      staff: ["Neha Saxena", "Tariq Ali"]
    }
  ],
  users: [
    {
      id: "user-stu-1",
      name: "Aarav Sharma",
      email: "aarav.sharma@campus.edu",
      role: "student",
      studentId: "STU-2026-1049",
      department: "Computer Science",
      hostelOrBuilding: "Aryabhatta Hall, Room 302"
    },
    {
      id: "user-stu-2",
      name: "Priya Patel",
      email: "priya.patel@campus.edu",
      role: "student",
      studentId: "STU-2026-1182",
      department: "Electronics & Communication",
      hostelOrBuilding: "Kalpana Chawla Hall, Room 114"
    },
    {
      id: "user-admin-1",
      name: "Dr. Vikram Malhotra",
      email: "facilities.director@campus.edu",
      role: "admin",
      department: "Directorate of Campus Facilities",
      title: "Campus Facilities Director"
    },
    {
      id: "user-staff-1",
      name: "Rajesh Kumar",
      email: "rajesh.av@campus.edu",
      role: "staff",
      department: "AV Maintenance",
      title: "Lead AV Technician"
    },
    {
      id: "user-staff-2",
      name: "Suresh Verma",
      email: "suresh.elec@campus.edu",
      role: "staff",
      department: "Electrical Maintenance",
      title: "Senior Campus Electrician"
    },
    {
      id: "user-staff-3",
      name: "Anil Joshi",
      email: "anil.plumbing@campus.edu",
      role: "staff",
      department: "Plumbing & Water Systems",
      title: "Chief Plumber"
    }
  ],
  knowledgeBase: [
    {
      id: "kb-01",
      title: "Classroom AV & Laser Projector Troubleshooting Protocol",
      category: "AV Equipment",
      responsibleDepartment: "AV Maintenance",
      keywords: ["projector", "hdmi", "display", "screen", "presentation", "podium", "audio"],
      description: "Standard operating procedures for non-responsive projectors, no-signal errors, dim lamps, and remote control failures.",
      troubleshootingSteps: [
        "1. Check ceiling mount power indicator LED (Solid Green = Ready, Flashing Red = Lamp Overheat, Off = Power fault).",
        "2. Inspect podium HDMI/VGA switch box and patch cable connections.",
        "3. Perform 60-second power cycle from classroom master AV breaker switch.",
        "4. If 'Lamp Replacement Required' message persists, check spare bulb stock (Model: Optoma X340 bulb kit).",
        "5. Verify wall control keypad button backlight and signal receiver."
      ],
      createdAt: "2026-01-10T09:00:00.000Z"
    },
    {
      id: "kb-02",
      title: "Electrical Outages, Circuit Breaker & Lighting Protocols",
      category: "Electrical",
      responsibleDepartment: "Electrical Maintenance",
      keywords: ["light", "fan", "spark", "breaker", "socket", "power", "switchboard", "blackout", "tripped"],
      description: "Emergency and routine electrical repair procedures for lecture halls, laboratories, and hostel corridors.",
      troubleshootingSteps: [
        "1. Locate floor distribution box (DB) and inspect MCB/ELCB switches.",
        "2. Test line voltage using digital multimeter (acceptable range: 220V - 240V AC).",
        "3. Look for burnt smells or loose neutral wire terminations in the sub-panel.",
        "4. Replace tripped 16A/32A MCB if contact resistance exceeds safety threshold.",
        "5. For LED panel failures, check driver unit input capacitor and DC terminal."
      ],
      createdAt: "2026-01-12T10:30:00.000Z"
    },
    {
      id: "kb-03",
      title: "Plumbing, Restroom Fixtures & Water Leakage Protocol",
      category: "Plumbing",
      responsibleDepartment: "Plumbing & Water Systems",
      keywords: ["water", "leak", "tap", "flush", "drain", "pipe", "washroom", "toilet", "overflow"],
      description: "Procedures for active water leaks, flush valve failures, blocked drainage lines, and drinking water water coolers.",
      troubleshootingSteps: [
        "1. Immediately turn off the local isolation valve behind the fixture or the floor riser gate valve.",
        "2. Inspect washer gaskets and PTFE Teflon tape wrapping around threaded fittings.",
        "3. Clear trap debris using plumbing drain auger if slow drainage or overflow is reported.",
        "4. Replace damaged concealed dual-flush pneumatic actuators if valve does not seal.",
        "5. Test water pressure before reopening main gate valve to prevent hydraulic shock."
      ],
      createdAt: "2026-01-14T11:00:00.000Z"
    },
    {
      id: "kb-04",
      title: "HVAC & Split AC Air Flow Diagnostics",
      category: "HVAC",
      responsibleDepartment: "HVAC & Climate Control",
      keywords: ["ac", "cooling", "air conditioner", "thermostat", "heat", "ventilation", "chiller", "filter"],
      description: "Diagnostic checklist for inadequate cooling, abnormal rattling sounds, ice formation, and water dripping from indoor blower units.",
      troubleshootingSteps: [
        "1. Check air intake mesh filters for dust blockage; wash with low-pressure water if clogged.",
        "2. Inspect evaporator coils for frost buildup indicating low refrigerant R-410A charge.",
        "3. Verify condensate drain tray slope and clear microbial slime blockage with vacuum pump.",
        "4. Test outdoor compressor capacitor (45/5 uF) and contactor switch.",
        "5. Measure temperature delta between return air and supply grill (normal delta: 8C - 12C)."
      ],
      createdAt: "2026-01-16T14:15:00.000Z"
    },
    {
      id: "kb-05",
      title: "Campus Wi-Fi & Network Switch Incident Protocol",
      category: "Network / IT",
      responsibleDepartment: "IT & Campus Network",
      keywords: ["wifi", "internet", "network", "ethernet", "router", "ap", "connectivity", "slow", "dns"],
      description: "Steps for handling dead zones, flapping access points, PoE dropouts, and student authentication failures.",
      troubleshootingSteps: [
        "1. Check Access Point PoE LED status (Solid Blue = Connected 802.11ax, Amber = DHCP fail).",
        "2. Ping gateway and core distribution switch from the local VLAN.",
        "3. Check for rogue DHCP servers or IP address exhaustion in the subnet pool.",
        "4. Re-seat RJ-45 patch cable in wall faceplate and switch patch panel.",
        "5. Force AP restart via Cisco DNA Center / Aruba Central Controller."
      ],
      createdAt: "2026-01-18T16:00:00.000Z"
    },
    {
      id: "kb-06",
      title: "Civil Infrastructure & Classroom Furniture Safety",
      category: "Civil & Infrastructure",
      responsibleDepartment: "Civil & Infrastructure",
      keywords: ["chair", "desk", "bench", "door", "window", "tile", "cracked", "glass", "board"],
      description: "Safety guidelines for damaged tiered classroom seating, broken door hinges, and cracked window panes.",
      troubleshootingSteps: [
        "1. Cordon off the affected seat or damaged fixture with caution tape if hazardous.",
        "2. Check mounting bolts and anchor plates on floor-fastened tiered benches.",
        "3. Tighten or replace heavy-duty stainless steel hinge screws on classroom fire-doors.",
        "4. Replace loose false-ceiling grid tiles to prevent fall hazards.",
        "5. Update inventory status in asset register."
      ],
      createdAt: "2026-01-20T11:45:00.000Z"
    }
  ],
  complaints: [
    {
      ticketId: "CF-2026-0001",
      studentName: "Priya Patel",
      studentId: "STU-2026-1182",
      title: "Projector lamp flickering and dying in Classroom 204",
      description: "The ceiling projector in Classroom 204 flickered violently during morning lectures and then powered off completely. Remote has red blinking warning light.",
      building: "Academic Block A",
      room: "Classroom 204",
      location: "Academic Block A, Classroom 204",
      category: "Equipment Failure",
      priority: "Medium",
      priorityReason: "Classroom projector is failing intermittently, disrupting morning lecture presentations.",
      urgencyScore: 6,
      assignedDepartment: "AV Maintenance",
      assignedStaff: "Rajesh Kumar",
      investigationSummary: "Historical record found: Room 204 projector had HDMI cable replaced last month. Lamp hours estimated near 3,000 hrs threshold.",
      suggestedAction: "Inspect projector power and connection, check lamp hour meter, carry spare Optoma bulb kit.",
      status: "In Progress",
      createdAt: "2026-11-20T10:15:00.000Z",
      updatedAt: "2026-11-21T14:30:00.000Z",
      workflowId: "wf-sample-001",
      notes: [
        {
          author: "Rajesh Kumar",
          role: "staff",
          text: "Checked lamp counter; it shows 2940 hours. Sourcing replacement bulb from central warehouse.",
          timestamp: "2026-11-21T14:30:00.000Z"
        }
      ]
    },
    {
      ticketId: "CF-2026-0002",
      studentName: "Aarav Sharma",
      studentId: "STU-2026-1049",
      title: "Major water pipe leak causing floor flooding in Science Block washroom",
      description: "Continuous pressurized water spraying from the main supply pipe under the third sink in 2nd floor men's washroom. Water spreading towards the hallway.",
      building: "Science Block",
      room: "2nd Floor Restroom B",
      location: "Science Block, 2nd Floor Restroom B",
      category: "Plumbing Failure",
      priority: "High",
      priorityReason: "Active pressurized water flooding poses structural damage and electrical short-circuit risk near corridor switchboards.",
      urgencyScore: 9,
      assignedDepartment: "Plumbing & Water Systems",
      assignedStaff: "Anil Joshi",
      investigationSummary: "High risk active flooding. Cross-referenced plumbing schematics for Science Block riser valve isolation.",
      suggestedAction: "Immediately shut off 2nd floor riser isolation valve and replace burst braided connector hose.",
      status: "Resolved",
      createdAt: "2026-11-18T08:30:00.000Z",
      updatedAt: "2026-11-18T11:45:00.000Z",
      workflowId: "wf-sample-002",
      notes: [
        {
          author: "Anil Joshi",
          role: "staff",
          text: "Riser valve shut at 08:45 AM. Replaced burst braided steel flex hose and Teflon seal.",
          timestamp: "2026-11-18T10:15:00.000Z"
        },
        {
          author: "Dr. Vikram Malhotra",
          role: "admin",
          text: "Physical inspection confirmed. Area sanitized and dry. Verified resolution.",
          timestamp: "2026-11-18T11:45:00.000Z"
        }
      ]
    },
    {
      ticketId: "CF-2026-0003",
      studentName: "Rohan Verma",
      studentId: "STU-2026-1304",
      title: "Ceiling fan regulator loose and sparking in Library Study Hall 3",
      description: "Fan #4 regulator knob sparks when adjusted and only spins at maximum speed or turns off. Mild burning smell noticed.",
      building: "Central Library",
      room: "Study Hall 3 (Level 2)",
      location: "Central Library, Study Hall 3 (Level 2)",
      category: "Electrical Failure",
      priority: "High",
      priorityReason: "Electrical sparks and burning smell present immediate fire hazard in public study area.",
      urgencyScore: 9,
      assignedDepartment: "Electrical Maintenance",
      assignedStaff: "Suresh Verma",
      investigationSummary: "Matches Electrical Outages & Lighting Protocol KB-02. Step 1 requires circuit isolation.",
      suggestedAction: "Isolate circuit from DB-Library-L2, replace stepped electronic regulator switch and inspect neutral wiring.",
      status: "Pending",
      createdAt: "2026-11-22T16:20:00.000Z",
      updatedAt: "2026-11-22T16:25:00.000Z",
      workflowId: "wf-sample-003",
      notes: []
    }
  ],
  agentExecutions: [],
  workflowLogs: [],
  notifications: [
    {
      notificationId: "notif-001",
      userId: "user-stu-2",
      targetRole: "student",
      title: "Maintenance In Progress",
      message: "Ticket CF-2026-0001 (Projector lamp in Classroom 204) has been assigned to technician Rajesh Kumar.",
      type: "status_update",
      readStatus: false,
      ticketId: "CF-2026-0001",
      createdAt: "2026-11-21T14:30:00.000Z"
    },
    {
      notificationId: "notif-002",
      userId: "user-stu-1",
      targetRole: "student",
      title: "Ticket Resolved!",
      message: "Ticket CF-2026-0002 (Water pipe leak in Science Block) was physically inspected and confirmed resolved.",
      type: "resolution",
      readStatus: true,
      ticketId: "CF-2026-0002",
      createdAt: "2026-11-18T11:45:00.000Z"
    },
    {
      notificationId: "notif-003",
      userId: "user-admin-1",
      targetRole: "admin",
      title: "High Priority Complaint Alert",
      message: "New High Priority complaint submitted: Fan regulator sparking in Library Study Hall 3. Immediate dispatch initiated.",
      type: "high_priority",
      readStatus: false,
      ticketId: "CF-2026-0003",
      createdAt: "2026-11-22T16:25:00.000Z"
    }
  ]
};

class StorageService {
  constructor() {
    this.dbFile = DB_FILE;
    this.memoryData = null;
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(this.dbFile)) {
        this.memoryData = JSON.parse(JSON.stringify(SEED_DATA));
        this.saveToDisk();
        console.log(`[Storage] Initialized new persistent database at ${this.dbFile}`);
      } else {
        const raw = fs.readFileSync(this.dbFile, 'utf8');
        this.memoryData = JSON.parse(raw);
        console.log(`[Storage] Loaded existing database with ${this.memoryData.complaints?.length || 0} complaints.`);
      }
    } catch (err) {
      console.error("[Storage] Database initialization error, fallback to seed:", err);
      this.memoryData = JSON.parse(JSON.stringify(SEED_DATA));
    }
  }

  saveToDisk() {
    try {
      fs.writeFileSync(this.dbFile, JSON.stringify(this.memoryData, null, 2), 'utf8');
    } catch (err) {
      console.error("[Storage] Error writing to disk:", err);
    }
  }

  getStorageMode() {
    const hasFirebase = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL);
    return {
      mode: hasFirebase ? "Firebase Firestore (Connected)" : "Local Persistent JSON DB (Disk Persisted)",
      isFirebase: hasFirebase,
      persistentPath: this.dbFile,
      records: {
        complaints: this.memoryData.complaints.length,
        knowledgeBase: this.memoryData.knowledgeBase.length,
        departments: this.memoryData.departments.length,
        agentExecutions: this.memoryData.agentExecutions.length,
        workflowLogs: this.memoryData.workflowLogs.length
      }
    };
  }

  resetToSeed() {
    this.memoryData = JSON.parse(JSON.stringify(SEED_DATA));
    this.saveToDisk();
    return { success: true, message: "Database reset to rich demonstration state." };
  }

  // --- Complaints ---
  getComplaints(filter = {}) {
    let list = [...this.memoryData.complaints];
    if (filter.studentId) list = list.filter(c => c.studentId === filter.studentId);
    if (filter.status && filter.status !== 'All') list = list.filter(c => c.status === filter.status);
    if (filter.priority && filter.priority !== 'All') list = list.filter(c => c.priority === filter.priority);
    if (filter.department && filter.department !== 'All') list = list.filter(c => c.assignedDepartment === filter.department);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(c => 
        c.ticketId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getComplaintById(ticketId) {
    return this.memoryData.complaints.find(c => c.ticketId.toLowerCase() === ticketId.toLowerCase());
  }

  createComplaint(complaintData) {
    this.memoryData.complaints.unshift(complaintData);
    this.saveToDisk();
    return complaintData;
  }

  updateComplaint(ticketId, updates) {
    const index = this.memoryData.complaints.findIndex(c => c.ticketId.toLowerCase() === ticketId.toLowerCase());
    if (index === -1) return null;
    
    this.memoryData.complaints[index] = {
      ...this.memoryData.complaints[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk();
    return this.memoryData.complaints[index];
  }

  addComplaintNote(ticketId, note) {
    const complaint = this.getComplaintById(ticketId);
    if (!complaint) return null;
    if (!complaint.notes) complaint.notes = [];
    complaint.notes.push({
      ...note,
      timestamp: new Date().toISOString()
    });
    this.updateComplaint(ticketId, { notes: complaint.notes });
    return complaint;
  }

  generateNextTicketId() {
    const year = new Date().getFullYear();
    const count = this.memoryData.complaints.length + 1;
    const padded = String(count).padStart(4, '0');
    return `CF-${year}-${padded}`;
  }

  // --- Agent Executions & Workflow Logs ---
  logAgentExecution(executionRecord) {
    this.memoryData.agentExecutions.unshift(executionRecord);
    this.saveToDisk();
    return executionRecord;
  }

  getAgentExecutions(filter = {}) {
    let list = [...this.memoryData.agentExecutions];
    if (filter.ticketId) list = list.filter(e => e.ticketId === filter.ticketId);
    if (filter.agentName) list = list.filter(e => e.agentName === filter.agentName);
    if (filter.workflowId) list = list.filter(e => e.workflowId === filter.workflowId);
    return list;
  }

  saveWorkflowLog(workflowRecord) {
    const existingIdx = this.memoryData.workflowLogs.findIndex(w => w.workflowId === workflowRecord.workflowId);
    if (existingIdx >= 0) {
      this.memoryData.workflowLogs[existingIdx] = {
        ...this.memoryData.workflowLogs[existingIdx],
        ...workflowRecord,
        updatedAt: new Date().toISOString()
      };
    } else {
      this.memoryData.workflowLogs.unshift(workflowRecord);
    }
    this.saveToDisk();
    return workflowRecord;
  }

  getWorkflowLog(workflowId) {
    return this.memoryData.workflowLogs.find(w => w.workflowId === workflowId);
  }

  getAllWorkflowLogs() {
    return this.memoryData.workflowLogs;
  }

  // --- Knowledge Base ---
  getKnowledgeBase(query = '') {
    if (!query || query.trim() === '') return this.memoryData.knowledgeBase;
    const q = query.toLowerCase();
    const tokens = q.split(/\s+/).filter(t => t.length > 2);
    
    return this.memoryData.knowledgeBase.filter(k => {
      const titleLower = k.title.toLowerCase();
      const descLower = k.description.toLowerCase();
      const catLower = k.category.toLowerCase();
      const kwLower = k.keywords.map(kw => kw.toLowerCase());

      // Direct exact match
      if (titleLower.includes(q) || descLower.includes(q) || catLower.includes(q)) return true;
      if (kwLower.some(kw => q.includes(kw) || kw.includes(q))) return true;

      // Token overlap match
      const matchesToken = tokens.some(t => 
        titleLower.includes(t) || 
        descLower.includes(t) || 
        catLower.includes(t) || 
        kwLower.some(kw => kw.includes(t))
      );
      return matchesToken;
    });
  }

  createKnowledgeBaseItem(item) {
    const newItem = {
      ...item,
      id: `kb-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.memoryData.knowledgeBase.push(newItem);
    this.saveToDisk();
    return newItem;
  }

  // --- Departments ---
  getDepartments() {
    return this.memoryData.departments;
  }

  // --- Users ---
  getUsers(role = null) {
    if (!role) return this.memoryData.users;
    return this.memoryData.users.filter(u => u.role === role);
  }

  getUserById(id) {
    return this.memoryData.users.find(u => u.id === id);
  }

  // --- Notifications ---
  getNotifications(filter = {}) {
    let list = [...this.memoryData.notifications];
    if (filter.userId) {
      list = list.filter(n => n.userId === filter.userId || n.targetRole === filter.role || n.targetRole === 'all');
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createNotification(notif) {
    const newNotif = {
      notificationId: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      readStatus: false,
      ...notif
    };
    this.memoryData.notifications.unshift(newNotif);
    this.saveToDisk();
    return newNotif;
  }

  markNotificationRead(id) {
    const item = this.memoryData.notifications.find(n => n.notificationId === id);
    if (item) {
      item.readStatus = true;
      this.saveToDisk();
    }
    return item;
  }

  markAllNotificationsRead(userId) {
    this.memoryData.notifications.forEach(n => {
      if (!userId || n.userId === userId) {
        n.readStatus = true;
      }
    });
    this.saveToDisk();
    return true;
  }
}

export const storage = new StorageService();
