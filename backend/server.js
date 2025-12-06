import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeDatabase } from './database.js';
import customerRoutes from './routes/customers.js';
import dealRoutes from './routes/deals.js';
import taskRoutes from './routes/tasks.js';
import activityRoutes from './routes/activities.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Starting database initialization...');
    await initializeDatabase();
    console.log('Database initialized');

    // Routes
    console.log('Setting up routes...');
    app.use('/api/customers', customerRoutes);
    app.use('/api/deals', dealRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/activities', activityRoutes);
    app.use('/api/ai', aiRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'Server is running' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    });

    console.log(`Attempting to listen on port ${PORT}...`);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`CRM Backend running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
