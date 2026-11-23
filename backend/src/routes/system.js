import express from 'express';
import { storage } from '../services/storage.js';
import { getGeminiStatus } from '../services/gemini.js';

const router = express.Router();

/**
 * System Status & Providers
 */
router.get('/status', (req, res) => {
  try {
    const aiStatus = getGeminiStatus();
    const storageMode = storage.getStorageMode();
    return res.json({
      success: true,
      aiProvider: aiStatus,
      storageProvider: storageMode,
      uptime: process.uptime(),
      version: "1.0.0",
      campus: "National Institute of Technology & Engineering"
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Reset Demo Data
 */
router.post('/reset-demo', (req, res) => {
  try {
    const result = storage.resetToSeed();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Campus Departments
 */
router.get('/departments', (req, res) => {
  try {
    const departments = storage.getDepartments();
    return res.json({ success: true, departments });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Users & Roles
 */
router.get('/users', (req, res) => {
  try {
    const { role } = req.query;
    const users = storage.getUsers(role);
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Notifications
 */
router.get('/notifications', (req, res) => {
  try {
    const { userId, role } = req.query;
    const notifications = storage.getNotifications({ userId, role });
    const unreadCount = notifications.filter(n => !n.readStatus).length;
    return res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/notifications/:id/read', (req, res) => {
  try {
    const notif = storage.markNotificationRead(req.params.id);
    return res.json({ success: true, notification: notif });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/notifications/read-all', (req, res) => {
  try {
    const { userId } = req.body;
    storage.markAllNotificationsRead(userId);
    return res.json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
