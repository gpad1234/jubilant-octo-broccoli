import express from 'express';

const app = express();
const PORT = 5000;

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works' });
});

const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Server is listening and ready for requests');
});

// Keep process alive indefinitely
server.on('error', (err) => {
  console.error('Server error:', err);
});

