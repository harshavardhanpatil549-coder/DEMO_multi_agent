import express from 'express';
import { storage } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { query } = req.query;
    const items = storage.getKnowledgeBase(query);
    return res.json({
      success: true,
      count: items.length,
      knowledgeBase: items
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, category, responsibleDepartment, description, troubleshootingSteps, keywords } = req.body;
    if (!title || !responsibleDepartment || !description) {
      return res.status(400).json({ success: false, error: "Title, Department, and Description are required." });
    }

    const stepsArray = Array.isArray(troubleshootingSteps)
      ? troubleshootingSteps
      : (troubleshootingSteps || '').split('\n').filter(s => s.trim().length > 0);

    const kwArray = Array.isArray(keywords)
      ? keywords
      : (keywords || '').split(',').map(k => k.trim()).filter(Boolean);

    const newItem = storage.createKnowledgeBaseItem({
      title,
      category: category || "General Facilities",
      responsibleDepartment,
      description,
      troubleshootingSteps: stepsArray,
      keywords: kwArray
    });

    return res.status(201).json({
      success: true,
      message: "Knowledge base protocol registered successfully.",
      item: newItem
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
