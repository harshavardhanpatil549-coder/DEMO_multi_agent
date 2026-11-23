const API_BASE = '/api';

export const api = {
  // Complaints
  async getComplaints(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/complaints?${query}`);
    return res.json();
  },

  async getComplaintById(ticketId: string) {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(ticketId)}`);
    return res.json();
  },

  async submitComplaint(data: any, isAsync = false) {
    const res = await fetch(`${API_BASE}/complaints${isAsync ? '?async=true' : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateComplaintStatus(ticketId: string, payload: { status: string; noteText?: string; authorName?: string; authorRole?: string }) {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(ticketId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async reassignComplaint(ticketId: string, payload: { assignedDepartment?: string; assignedStaff?: string; noteText?: string; authorName?: string }) {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(ticketId)}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async addComplaintNote(ticketId: string, payload: { author: string; role: string; text: string }) {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(ticketId)}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Agent System & Command Center
  async getCommandCenter() {
    const res = await fetch(`${API_BASE}/agents/command-center`);
    return res.json();
  },

  async getWorkflowStatus(workflowId: string) {
    const res = await fetch(`${API_BASE}/agents/workflows/${encodeURIComponent(workflowId)}`);
    return res.json();
  },

  async getAgentExecutions(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/agents/executions?${query}`);
    return res.json();
  },

  async triggerDemoScenario(scenario: string, isAsync = false) {
    const res = await fetch(`${API_BASE}/agents/trigger-demo${isAsync ? '?async=true' : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    return res.json();
  },

  // Analytics
  async getAnalyticsDashboard() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    return res.json();
  },

  getExportCsvUrl() {
    return `${API_BASE}/analytics/export-csv`;
  },

  // Knowledge Base
  async getKnowledgeBase(query = '') {
    const res = await fetch(`${API_BASE}/knowledge-base?query=${encodeURIComponent(query)}`);
    return res.json();
  },

  async createKnowledgeBaseItem(data: any) {
    const res = await fetch(`${API_BASE}/knowledge-base`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // System
  async getSystemStatus() {
    const res = await fetch(`${API_BASE}/system/status`);
    return res.json();
  },

  async resetDemoData() {
    const res = await fetch(`${API_BASE}/system/reset-demo`, {
      method: 'POST'
    });
    return res.json();
  },

  async getDepartments() {
    const res = await fetch(`${API_BASE}/system/departments`);
    return res.json();
  },

  async getUsers(role?: string) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    const res = await fetch(`${API_BASE}/system/users${query}`);
    return res.json();
  },

  async getNotifications(userId?: string, role?: string) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);
    const res = await fetch(`${API_BASE}/system/notifications?${params.toString()}`);
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/system/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async markAllNotificationsRead(userId?: string) {
    const res = await fetch(`${API_BASE}/system/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }
};
