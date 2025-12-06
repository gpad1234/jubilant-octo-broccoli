import express from 'express';
import { dbRun, dbGet, dbAll } from '../database.js';

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await dbAll('SELECT * FROM activities ORDER BY createdAt DESC LIMIT 50');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create activity
router.post('/', async (req, res) => {
  try {
    const { type, customer, action, customerId } = req.body;

    if (!type || !customer || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      `INSERT INTO activities (type, customer, action, customerId)
       VALUES (?, ?, ?, ?)`,
      [type, customer, action, customerId]
    );

    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
