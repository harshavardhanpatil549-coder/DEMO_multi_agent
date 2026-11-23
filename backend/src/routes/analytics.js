import express from 'express';
import { storage } from '../services/storage.js';

const router = express.Router();

/**
 * Get comprehensive analytics aggregated from database
 */
router.get('/dashboard', (req, res) => {
  try {
    const complaints = storage.getComplaints();
    const executions = storage.getAgentExecutions();

    // Counts
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const highPriority = complaints.filter(c => c.priority === 'High').length;

    // Breakdown by Category
    const categoryMap = {};
    complaints.forEach(c => {
      const cat = c.category || 'General Maintenance';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const byCategory = Object.keys(categoryMap).map(cat => ({ name: cat, count: categoryMap[cat] }));

    // Breakdown by Priority
    const priorityMap = { High: 0, Medium: 0, Low: 0 };
    complaints.forEach(c => {
      const p = c.priority || 'Medium';
      priorityMap[p] = (priorityMap[p] || 0) + 1;
    });
    const byPriority = Object.keys(priorityMap).map(p => ({ name: p, count: priorityMap[p] }));

    // Breakdown by Department
    const deptMap = {};
    complaints.forEach(c => {
      const d = c.assignedDepartment || 'Unassigned';
      deptMap[d] = (deptMap[d] || 0) + 1;
    });
    const byDepartment = Object.keys(deptMap).map(d => ({ name: d, count: deptMap[d] }));

    // AI Performance
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'Completed').length;
    const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 100;
    
    const avgDuration = totalExecutions > 0
      ? Math.round(executions.reduce((acc, e) => acc + (e.durationMs || 0), 0) / totalExecutions)
      : 320;

    // Status ratio
    const statusBreakdown = [
      { name: 'Pending', count: pending, color: '#f59e0b' },
      { name: 'In Progress', count: inProgress, color: '#3b82f6' },
      { name: 'Resolved', count: resolved, color: '#10b981' }
    ];

    // Trends (Group by date over past 7 days)
    const trendMap = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      trendMap[key] = { date: key.slice(5), submitted: 0, resolved: 0 };
    }

    complaints.forEach(c => {
      const createdKey = (c.createdAt || '').slice(0, 10);
      if (trendMap[createdKey]) {
        trendMap[createdKey].submitted++;
      }
      if (c.status === 'Resolved' && c.updatedAt) {
        const resolvedKey = c.updatedAt.slice(0, 10);
        if (trendMap[resolvedKey]) {
          trendMap[resolvedKey].resolved++;
        }
      }
    });

    const weeklyTrends = Object.values(trendMap);

    return res.json({
      success: true,
      metrics: {
        total,
        pending,
        inProgress,
        resolved,
        highPriority,
        aiSuccessRate: `${successRate}%`,
        avgProcessingTimeMs: `${avgDuration} ms`,
        activeDepartments: Object.keys(deptMap).length
      },
      charts: {
        byCategory,
        byPriority,
        byDepartment,
        statusBreakdown,
        weeklyTrends
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Export full complaints dataset to CSV format
 */
router.get('/export-csv', (req, res) => {
  try {
    const complaints = storage.getComplaints();

    const headers = [
      "Ticket ID",
      "Title",
      "Category",
      "Priority",
      "Department",
      "Staff Assigned",
      "Status",
      "Building",
      "Room",
      "Student Name",
      "Student ID",
      "Created At",
      "Suggested Action"
    ];

    const rows = complaints.map(c => [
      `"${c.ticketId || ''}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${c.category || ''}"`,
      `"${c.priority || ''}"`,
      `"${c.assignedDepartment || ''}"`,
      `"${c.assignedStaff || ''}"`,
      `"${c.status || ''}"`,
      `"${c.building || ''}"`,
      `"${c.room || ''}"`,
      `"${c.studentName || ''}"`,
      `"${c.studentId || ''}"`,
      `"${c.createdAt || ''}"`,
      `"${(c.suggestedAction || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="CampusFix_Complaints_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
