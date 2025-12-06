import express from 'express';
import { dbRun, dbGet, dbAll } from '../database.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await dbAll('SELECT * FROM customers ORDER BY createdAt DESC');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await dbGet('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, address, city, state, zipCode, industry, status, notes } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      `INSERT INTO customers (name, email, phone, company, address, city, state, zipCode, industry, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, company, address, city, state, zipCode, industry, status, notes]
    );

    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, company, address, city, state, zipCode, industry, status, notes } = req.body;

    const result = await dbRun(
      `UPDATE customers SET 
       name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, state = ?, zipCode = ?, industry = ?, status = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, email, phone, company, address, city, state, zipCode, industry, status, notes, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM customers WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
