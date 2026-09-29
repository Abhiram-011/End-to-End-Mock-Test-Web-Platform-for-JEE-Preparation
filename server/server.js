require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, isUsingMongo } = require('./storage/db');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'JEE Prep Mock-Test API',
    version: '1.0.0',
    storage: isUsingMongo() ? 'MongoDB' : 'Embedded JSON Store (Persistent)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize DB and launch server
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 JEE Prep Backend Server running on http://localhost:${PORT}`);
      console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
      console.log(`🔑 Demo Accounts:`);
      console.log(`   - Student: student@jee.com  / student123`);
      console.log(`   - Teacher: teacher@jee.com  / teacher123`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  }
}

startServer();
