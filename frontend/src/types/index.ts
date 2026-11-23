export type UserRole = 'student' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  title?: string;
  hostelOrBuilding?: string;
}

export interface Note {
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface Complaint {
  ticketId: string;
  studentName: string;
  studentId: string;
  title: string;
  description: string;
  building: string;
  room: string;
  location: string;
  category: string;
  equipment?: string;
  priority: 'Low' | 'Medium' | 'High';
  priorityReason: string;
  urgencyScore?: number;
  assignedDepartment: string;
  assignedStaff: string;
  investigationSummary?: string;
  suggestedAction?: string;
  protocolApplied?: string;
  recommendedTools?: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Resolved' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  workflowId?: string;
  image?: string;
  notes?: Note[];
  resolvedAt?: string;
  resolvedBy?: string;
  aiAnalysis?: {
    detection?: any;
    priority?: any;
    investigation?: any;
    action?: any;
    source?: string;
  };
}

export interface AgentExecution {
  executionId: string;
  workflowId: string;
  ticketId?: string;
  agentName: string;
  status: 'Waiting' | 'Processing' | 'Completed' | 'Failed' | 'Retrying';
  input: any;
  output: any;
  source?: string;
  durationMs: number;
  startedAt: string;
  completedAt: string;
  attempt?: number;
  errorMessage?: string;
}

export interface WorkflowLog {
  workflowId: string;
  ticketId?: string;
  coordinatorStatus: string;
  currentStep: string;
  agents: Record<string, {
    status: 'Waiting' | 'Processing' | 'Completed' | 'Failed' | 'Retrying';
    role?: string;
    output?: any;
    durationMs?: number;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
  }>;
  complaint: {
    title: string;
    building: string;
    room: string;
    studentName?: string;
  };
  results?: any;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  lead: string;
  contact: string;
  slaHours: number;
  staff: string[];
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: string;
  responsibleDepartment: string;
  keywords: string[];
  description: string;
  troubleshootingSteps: string[];
  createdAt: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  targetRole: string;
  title: string;
  message: string;
  type: string;
  readStatus: boolean;
  ticketId?: string;
  createdAt: string;
}

export interface SystemStatus {
  aiProvider: {
    isConfigured: boolean;
    model: string;
    provider: string;
    status: string;
  };
  storageProvider: {
    mode: string;
    isFirebase: boolean;
    persistentPath: string;
    records: {
      complaints: number;
      knowledgeBase: number;
      departments: number;
      agentExecutions: number;
      workflowLogs: number;
    };
  };
  uptime: number;
  version: string;
}
