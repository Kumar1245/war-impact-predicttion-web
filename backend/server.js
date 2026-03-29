/**
 * War Impact API - Main Server Entry Point
 * Production-ready Express server with scalable architecture
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const articlesRoutes = require('./src/routes/articles');
const marketRoutes = require('./src/routes/market');
const newsRoutes = require('./src/routes/news');
const analysisRoutes = require('./src/routes/analysis');
const scenariosRoutes = require('./src/routes/scenarios');

// Import middleware
const ErrorHandler = require('./src/middleware/errorHandler');
const RequestLogger = require('./src/middleware/requestLogger');

// Import utilities
const ApiResponse = require('./src/utils/ApiResponse');

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============

// CORS - Enable Cross-Origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(RequestLogger.log);
app.use(RequestLogger.requestId);

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json(ApiResponse.success({
    status: 'OK',
    service: 'War Impact API',
    version: '1.0.0',
    pythonService: process.env.PYTHON_SERVICE_URL || 'http://localhost:5001',
    timestamp: new Date().toISOString()
  }, 'API is running'));
});

// ============ API ROUTES ============

// Articles routes
app.use('/api/articles', articlesRoutes);

// Market data routes
app.use('/api/market-data', marketRoutes);

// News routes
app.use('/api/news', newsRoutes);

// Analysis routes (Python ML service)
app.use('/api/analyze', analysisRoutes);

// Scenarios routes
app.use('/api/scenarios', scenariosRoutes);

// ============ LEGACY ROUTES (Backward Compatibility ============

// Legacy scenario endpoint (POST /api/scenario)
app.post('/api/scenario', (req, res) => {
  const { region, intensity } = req.body;
  
  if (!region || !intensity) {
    return res.status(400).json(
      ApiResponse.validationError([
        { field: 'region', message: 'Region is required' },
        { field: 'intensity', message: 'Intensity is required' }
      ])
    );
  }

  // Import and use ScenarioService
  const scenarioService = require('./src/services/scenarioService');
  const impact = scenarioService.getImpact(region, intensity);
  
  res.json(ApiResponse.success(impact, 'Impact retrieved successfully'));
});

// Legacy scenarios endpoint (GET /api/scenarios)
app.get('/api/scenarios', (req, res) => {
  const scenarioService = require('./src/services/scenarioService');
  const scenarios = scenarioService.getAllScenarios();
  res.json(ApiResponse.success(scenarios, 'Scenarios retrieved successfully'));
});

// Legacy geopolitical risk endpoint
app.get('/api/geopolitical-risk', (req, res) => {
  const scenarioService = require('./src/services/scenarioService');
  const riskData = scenarioService.getRiskAssessment();
  res.json(ApiResponse.success(riskData, 'Risk data retrieved successfully'));
});

// Legacy export endpoint
app.get('/api/export/:type', (req, res) => {
  const { type } = req.params;
  const format = req.query.format || 'json';
  
  let data;
  let filename;
  
  switch (type) {
    case 'articles':
      const articlesService = require('./src/services/articlesService');
      data = articlesService.getAllArticles().articles;
      filename = 'articles.json';
      break;
    case 'scenarios':
      const scenarioService = require('./src/services/scenarioService');
      data = scenarioService.getAllScenarios();
      filename = 'scenarios.json';
      break;
    default:
      return res.status(400).json(ApiResponse.error('Invalid export type', 'INVALID_TYPE'));
  }
  
  if (format === 'csv' && type === 'articles') {
    const csv = 'id,title,category,author,date\n' +
      data.map(a => `${a.id},"${a.title.replace(/"/g, '""')}",${a.category},${a.author},${a.date}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename.replace('.json', '.csv')}`);
    return res.send(csv);
  }
  
  res.json(ApiResponse.success(data, 'Data exported successfully'));
});

// ============ ERROR HANDLING ============

// 404 handler
app.use(ErrorHandler.notFound);

// Global error handler
app.use(ErrorHandler.handle);

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`\n🚀 War Impact API Server`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Python Service: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:5001'}`);
  console.log(`\n   API Endpoints:`);
  console.log(`   - GET  /api/health          - Health check`);
  console.log(`   - GET  /api/articles        - Get all articles`);
  console.log(`   - GET  /api/articles/:slug  - Get article by slug`);
  console.log(`   - GET  /api/market-data     - Get market data`);
  console.log(`   - GET  /api/news            - Get news`);
  console.log(`   - GET  /api/news/analyzed   - Get analyzed news`);
  console.log(`   - POST /api/analyze         - Analyze text`);
  console.log(`   - POST /api/predict-impact - Predict impact`);
  console.log(`   - POST /api/chart-data      - Generate chart data`);
  console.log(`   - GET  /api/scenarios       - Get all scenarios`);
  console.log(`   - POST /api/scenario        - Get scenario impact`);
  console.log(`   - GET  /api/geopolitical-risk - Get risk data`);
  console.log(`   - GET  /api/export/:type    - Export data\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
