const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data
const mockItems = [
  { id: 1, name: 'Angular Material', description: 'UI component library for Angular applications' },
  { id: 2, name: 'RxJS', description: 'Reactive programming library for JavaScript' },
  { id: 3, name: 'TypeScript', description: 'Typed superset of JavaScript' },
  { id: 4, name: 'Node.js', description: 'JavaScript runtime built on Chrome V8 engine' },
  { id: 5, name: 'Express.js', description: 'Fast, unopinionated web framework for Node.js' },
  { id: 6, name: 'MongoDB', description: 'NoSQL database program' },
  { id: 7, name: 'Docker', description: 'Containerization platform' },
  { id: 8, name: 'Kubernetes', description: 'Container orchestration system' },
  { id: 9, name: 'AWS', description: 'Cloud computing platform' },
  { id: 10, name: 'Git', description: 'Distributed version control system' }
];

// Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation - accept any email/password combination
  if (email && password) {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      token,
      user: { email }
    });
  } else {
    res.status(400).json({ error: 'Email and password are required' });
  }
});

app.get('/api/items', (req, res) => {
  // Simulate network delay
  setTimeout(() => {
    res.json(mockItems);
  }, 1000);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/login');
  console.log('  GET /api/items');
  console.log('  GET /api/health');
});
