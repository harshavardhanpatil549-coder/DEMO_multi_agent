# 🏫 CampusFix AI
## Autonomous Multi-Agent Campus Maintenance Management Platform

> **Hackathon Theme:** *"Multi-Agent Autonomy That Gets Real Work Done."*

---

## 📌 1. Project Overview

**CampusFix AI** is a full-stack, autonomous multi-agent campus maintenance management platform that automates the complete lifecycle of reporting, analyzing, prioritizing, investigating, and resolving physical infrastructure complaints across educational institutions.

Traditional campus maintenance relies on manual complaint boxes, fragmented phone calls, delayed triage, and lost paperwork. Students frequently face non-functional projectors, leaking pipes, sparking electrical switchboards, broken classroom seating, and lab equipment outages without transparency into when or how issues will be resolved.

**CampusFix AI solves this problem through genuine multi-agent autonomy:**
1. A student submits a complaint describing an issue in natural language.
2. A **Central Coordinator** orchestrates four specialized AI agents in sequence.
3. **Agent 1 (Issue Detection)** extracts technical entities, equipment models, categories, and campus coordinates.
4. **Agent 2 (Priority Analysis)** evaluates academic urgency (e.g. tomorrow's presentation, examination hall) and student impact to objectively assign Low, Medium, or High priority.
5. **Agent 3 (Investigation)** executes real database tool searches across historical tickets and campus Standard Operating Procedure (SOP) Knowledge Base protocols.
6. **Agent 4 (Action)** confirms database persistence, generates an official maintenance ticket (`CF-2026-XXXX`), assigns lead departmental technicians, and dispatches in-app notifications.
7. Maintenance staff and administrators track, update, and physically sign off on tickets through interconnected role-based portals.

---

## 🤖 2. Multi-Agent System Architecture

```
Student Complaint Submission
          │
          ▼
┌────────────────────────────────────────────────────────┐
│             CENTRAL AI COORDINATOR                     │
│  - Input sanitization & duplicate prevention (30m)    │
│  - Pipeline orchestration & async state tracking      │
│  - Validation of JSON outputs & automatic retries      │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   AGENT 1    │───▶│   AGENT 2    │───▶│   AGENT 3    │───┐
│ Issue        │    │ Priority     │    │ Investigation│   │
│ Detection    │    │ Analysis     │    │ Agent        │   │
└──────────────┘    └──────────────┘    └──────────────┘   │
                                                │          │
                                                ▼          ▼
                                        ┌──────────────┐ ┌──────────────┐
                                        │ LIVE TOOLS   │ │   AGENT 4    │
                                        │ - Complaints │ │ Action       │
                                        │   Database   │ │ Agent        │
                                        │ - Knowledge  │ └──────┬───────┘
                                        │   Base SOPs  │        │
                                        └──────────────┘        ▼
                                                       ┌─────────────────┐
                                                       │ OFFICIAL TICKET │
                                                       │ CF-2026-XXXX    │
                                                       │ (Persisted)     │
                                                       └─────────────────┘
```

### The Four Specialized AI Agents

| Agent | Name | Role & Responsibility | Tool Usage & Output |
| :--- | :--- | :--- | :--- |
| **01** | **Issue Detection Agent** | Natural language entity extraction, technical category classification, affected equipment identification, location normalization. | Detects equipment (e.g., Optoma ceiling projector, flush valve, MCB switchboard) and flags missing diagnostic parameters. |
| **02** | **Priority Analysis Agent** | Academic urgency and student population impact scoring (1-10). Evaluates immediate academic deadlines (presentations, exams, lectures). | Objectively assigns `Low`, `Medium`, or `High` priority with transparent rationale. Does *not* default everything to High. |
| **03** | **Investigation Agent** | Forensic diagnosis utilizing **real system tools**. Searches past incident records and official Campus SOP Knowledge Base protocols. | Queries Complaints DB for recurring faults in that room; cross-references standard operating procedures (KB-01 through KB-06). |
| **04** | **Action Agent** | Transaction validation, ticket generation (`CF-2026-XXXX`), duty lead technician assignment, and persistent database commit. | Confirms database write, writes audit notes, and dispatches in-app student and administrator alerts. |

---

## 🛠️ 3. Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React icons, Recharts (analytics), Vite 6.
- **Backend:** Node.js (v26+ ES Modules), Express.js, REST APIs, Multer (attachments).
- **AI Core:** Google Gemini API (`gemini-1.5-flash`) with structured JSON schema system instructions, paired with a resilient, high-fidelity Cognitive Heuristic Engine for seamless offline or fallback operation.
- **Database:** Disk-persisted Local JSON Database engine (`backend/data/db.json`) with atomic file writes, complete seed datasets, and Firebase Firestore compatibility adapter.
- **Version Control:** Git repository initialized with `Initial Commit` and finalizing with `Final Submission`.

---

## 📱 4. Application Portals & Structure

### Public Portal
- **Landing Page:** Hero section, SaaS branding, 4 AI agent showcase cards, platform benefits, live demo launcher.
- **About CampusFix AI:** System design philosophy, architecture, and technology stack breakdown.
- **How It Works:** Interactive multi-agent pipeline explanation from submission to physical resolution.
- **Demo Role Selection:** Instant 1-click persona switcher between Students, Facilities Directors, and Technicians.

### Student Portal
- **Student Dashboard:** Real-time KPI summary cards (Total, Pending, In Progress, Resolved), recent tickets table.
- **Report a New Issue:** Validated submission form with demo scenario presets (e.g., *Classroom 204 Projector*), image upload, and live workflow observer modal.
- **My Complaints:** Personal complaint history with category and priority filters.
- **Track Complaint:** Search by ticket reference with visual progress timeline separating AI processing (~1.5s) from physical maintenance.
- **Profile:** Student identification and campus residence records.

### Admin Portal
- **Administrative Overview:** 6 KPI metrics, high-priority emergency alert banner, active tickets feed.
- **All Complaints / Maintenance Tickets:** Searchable, filterable management table; department reassignment, technician allocation, status changes, internal notes, resolution sign-off.
- **AI Agent Command Center:** The centerpiece for judges! Visual interactive pipeline flowchart, 4 agent cards with input/output JSON inspectors, timing in milliseconds, and live execution terminal.
- **Agent Execution Logs:** Searchable JSON execution logs capturing every agent invocation and payload.
- **Department Management:** Division overview (AV, Electrical, Plumbing, HVAC, Civil, Network) with SLAs and staff.
- **Analytics & Reports:** Interactive charts (by category, priority, department, resolution ratio, trends) and **Export to CSV**.
- **Knowledge Base:** Campus standard troubleshooting protocols (KB-01 to KB-06) searchable and expandable.
- **User Management & Settings:** System uptime, Gemini status, database persistence mode, and 1-click demo data reset.

### Maintenance Staff Portal
- **Staff Dashboard:** Daily queue summary, urgent task counter, completed task history.
- **Assigned Field Queue:** Departmental ticket backlog with location and AI-recommended repair steps.
- **Update Progress:** Add technician field notes, change status to *In Progress*, and mark tasks as *Completed* for admin verification.
- **Completed Tasks:** Historical log of verified repairs.

---

## 🚀 5. Installation & Setup Guide

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v26)
- npm (v9 or higher)

### Repository Setup
```bash
# Clone the repository
git clone https://github.com/your-username/campusfix-ai.git
cd demo

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
cd ..
```

### Environment Configuration
The backend comes pre-configured with a `.env` and `.env.example` file in `backend/`:

```env
PORT=5000
NODE_ENV=development

# Google Gemini API Key (Optional)
# If provided, the system executes live calls to gemini-1.5-flash.
# If omitted, the high-fidelity cognitive multi-agent engine runs autonomously.
GEMINI_API_KEY=

# Firebase Firestore Configuration (Optional)
# If omitted, CampusFix AI operates in persistent Local Database mode (backed by backend/data/db.json).
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## 🏃 6. Running the Application

### Option A: Run Both Backend & Frontend Simultaneously
In two terminal tabs:

**Terminal 1 (Backend Server on Port 5000):**
```bash
cd backend
npm start
```
*Backend will start at: `http://localhost:5000`*

**Terminal 2 (Frontend Dev Server on Port 5173):**
```bash
cd frontend
npm run dev
```
*Frontend will start at: `http://localhost:5173`*

### Option B: Unified Production Build (Single Port)
The backend is already configured to build and serve the compiled frontend!
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Start unified server
cd ../backend
npm start
```
*Access the entire full-stack application at: `http://localhost:5000`*

---

## 🎯 7. Official Hackathon Demonstration Walkthrough

To demonstrate the required scenario to judges:

> **Official Prompt:**
> *"The projector in classroom 204 is not working and we have a presentation tomorrow."*

### Step-by-Step Demonstration Script:
1. Open the application at `http://localhost:5173` (or `http://localhost:5000`).
2. Click **"Run Official Demo"** in the top navigation bar, or navigate to **"Report a New Issue"** and click the **"Official Demo (Classroom 204 Projector)"** preset button.
3. Click **"Submit Complaint & Start AI Pipeline"**.
4. Observe the live modal execute:
   - **Central Coordinator:** Validates inputs, creates workflow execution record.
   - **Agent 1 (Issue Detection):** Identifies `Equipment Failure`, equipment `Ceiling Mounted Projector`, and location `Classroom 204`.
   - **Agent 2 (Priority Analysis):** Analyzes deadline urgency ("presentation tomorrow") and assigns **High** priority with full reasoning.
   - **Agent 3 (Investigation):** Queries the database tool, discovers prior ticket in Classroom 204 (`CF-2026-0001`), queries the Knowledge Base tool, and prescribes `Classroom AV & Laser Projector Troubleshooting Protocol (KB-01)`.
   - **Agent 4 (Action):** Validates the pipeline, generates ticket `CF-2026-0005`, commits to disk, and assigns technician `Rajesh Kumar` (`AV Maintenance`).
5. Click **"View in AI Command Center"** to inspect the live flowchart, execution times (in milliseconds), agent input/output JSON schemas, and terminal logs.
6. Switch role to **"Staff (Rajesh Kumar)"** via the top bar role switcher:
   - Open **"Assigned Field Queue"** to read the AI-suggested troubleshooting steps.
   - Update status to **"In Progress"** and add a field note: *"Testing lamp indicator and HDMI cable."*
   - Mark task as **"Completed"**.
7. Switch role to **"Admin (Dr. Vikram Malhotra)"**:
   - Open **"All Complaints"**, locate the ticket, verify the technician's notes, and mark as **"Resolved"** (confirmed physical repair).
8. Open **"Track Complaint"** as a Student to inspect the complete milestone timeline.
9. Open **"Analytics & Reports"** to view real-time charts and download the exported CSV.

---

## 👥 8. Demo Personas & Credentials

CampusFix AI includes pre-configured demo personas accessible via the **Role Switcher** in the top bar:

| Role | Persona Name | Campus ID / Title | Department |
| :--- | :--- | :--- | :--- |
| **Student** | Aarav Sharma | `STU-2026-1049` | Computer Science & Engineering |
| **Student** | Priya Patel | `STU-2026-1182` | Electronics & Communication |
| **Admin** | Dr. Vikram Malhotra | Campus Facilities Director | Directorate of Campus Facilities |
| **Staff** | Rajesh Kumar | Lead AV Specialist | AV Maintenance |
| **Staff** | Suresh Verma | Senior Campus Electrician | Electrical Maintenance |
| **Staff** | Anil Joshi | Chief Plumber | Plumbing & Water Systems |

---

## 🏆 9. Hackathon Problem Statement Verification

| Requirement | Implementation in CampusFix AI |
| :--- | :--- |
| **Multiple agents working as a team** | 4 distinct agents (Detection, Priority, Investigation, Action) coordinated by Central AI Coordinator. |
| **Autonomous decision-making** | Automated category deduction, objective urgency score, department routing, and lead technician dispatch. |
| **Reasoning and planning** | Evaluates academic disruption vs routine cosmetic issues; synthesizes SOP troubleshooting procedures. |
| **Actual tool usage** | Real tool queries against historical complaints database and Knowledge Base standard protocols. |
| **Database integration** | Persistent disk storage (`backend/data/db.json`) with Firestore adapter; persists across reboots. |
| **Background task coordination** | Asynchronous workflow execution with persistent state and real-time polling stream. |
| **Event-based workflow initiation** | Triggered immediately on student submission or demo scenario trigger. |
| **Error handling & retry mechanisms** | Coordinator implements up to 2 automated retries per agent with state logging on failure. |
| **Real-world task completion** | Full operational lifecycle: student grievance ➔ AI triage ➔ technician repair ➔ administrative resolution. |

---

## 📄 License
MIT License. Developed for the 2026 Multi-Agent Autonomy Hackathon.
