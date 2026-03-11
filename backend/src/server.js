require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const transactionsRoutes = require('./routes/transactions');
const insightsRoutes = require('./routes/insights');
const healthScoreRoutes = require('./routes/health-score');
const predictionsRoutes = require('./routes/predictions');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Copilot API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/transactions', transactionsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/health-score', healthScoreRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI-Powered Finance Copilot API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      transactions: '/api/transactions',
      insights: '/api/insights',
      healthScore: '/api/health-score',
      predictions: '/api/predictions',
      chat: '/api/chat',
      auth: '/api/auth'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
