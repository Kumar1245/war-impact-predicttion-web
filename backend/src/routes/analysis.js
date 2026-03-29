/**
 * Analysis Routes
 * Defines all analysis-related API endpoints (Python ML service)
 */

const express = require('express');
const router = express.Router();
const AnalysisController = require('../controllers/analysisController');

// POST /api/analyze - Analyze text (sentiment/summary/both)
router.post('/analyze', AnalysisController.analyze);

// POST /api/analyze/sentiment - Get sentiment analysis
router.post('/sentiment', AnalysisController.getSentiment);

// POST /api/analyze/summary - Get text summary
router.post('/summary', AnalysisController.getSummary);

// POST /api/predict-impact - Predict war impact
router.post('/predict-impact', AnalysisController.predictImpact);

// POST /api/chart-data - Generate chart data
router.post('/chart-data', AnalysisController.generateChartData);

// GET /api/analyze/health - Check Python service health
router.get('/health', AnalysisController.checkHealth);

module.exports = router;
