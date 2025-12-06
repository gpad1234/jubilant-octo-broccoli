import express from 'express';
import { dbRun, dbGet, dbAll } from '../database.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await dbAll('SELECT * FROM tasks ORDER BY time ASC');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { task, priority, time, customerId } = req.body;

    if (!task || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      `INSERT INTO tasks (task, priority, time, customerId)
       VALUES (?, ?, ?, ?)`,
      [task, priority || 'medium', time, customerId]
    );

    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { task, priority, time, customerId } = req.body;

    const result = await dbRun(
      `UPDATE tasks SET task = ?, priority = ?, time = ?, customerId = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [task, priority, time, customerId, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM tasks WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
