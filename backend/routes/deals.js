import express from 'express';
import { dbRun, dbGet, dbAll } from '../database.js';

const router = express.Router();

// Get all deals
router.get('/', async (req, res) => {
  try {
    const deals = await dbAll('SELECT * FROM deals ORDER BY createdAt DESC');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deals by stage
router.get('/stage/:stage', async (req, res) => {
  try {
    const deals = await dbAll('SELECT * FROM deals WHERE stage = ? ORDER BY createdAt DESC', [req.params.stage]);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create deal
router.post('/', async (req, res) => {
  try {
    const { title, value, contact, stage, customerId, date } = req.body;

    if (!title || !value || !contact || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      `INSERT INTO deals (title, value, contact, stage, customerId, date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, value, contact, stage || 'prospect', customerId, date]
    );

    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update deal stage
router.put('/:id', async (req, res) => {
  try {
    const { title, value, contact, stage, customerId, date } = req.body;

    const result = await dbRun(
      `UPDATE deals SET title = ?, value = ?, contact = ?, stage = ?, customerId = ?, date = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, value, contact, stage, customerId, date, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete deal
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM deals WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
