/**
 * Analysis Controller
 * Handles all analysis-related HTTP requests (Python ML service integration)
 */

const pythonService = require('../services/pythonService');
const ApiResponse = require('../utils/ApiResponse');
const { Validator, schemas } = require('../middleware/validator');

class AnalysisController {
  /**
   * Analyze text (sentiment/summary)
   */
  static async analyze(req, res) {
    try {
      const { text, type } = req.body;
      
      // Validate request
      const validationError = Validator.validate(schemas.analyze)(req, res, () => {});
      if (validationError) return;

      const result = await pythonService.analyze(text, type);
      res.json(ApiResponse.success(result, 'Analysis completed successfully'));
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json(ApiResponse.error('Analysis service unavailable', 'ANALYSIS_ERROR'));
    }
  }

  /**
   * Get sentiment analysis
   */
  static async getSentiment(req, res) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json(ApiResponse.validationError([{ field: 'text', message: 'Text is required' }]));
      }

      const result = await pythonService.getSentiment(text);
      res.json(ApiResponse.success(result, 'Sentiment analysis completed successfully'));
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      res.status(500).json(ApiResponse.error('Sentiment analysis unavailable', 'SENTIMENT_ERROR'));
    }
  }

  /**
   * Get summary
   */
  static async getSummary(req, res) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json(ApiResponse.validationError([{ field: 'text', message: 'Text is required' }]));
      }

      const result = await pythonService.getSummary(text);
      res.json(ApiResponse.success(result, 'Summary generated successfully'));
    } catch (error) {
      console.error('Summary error:', error);
      res.status(500).json(ApiResponse.error('Summary service unavailable', 'SUMMARY_ERROR'));
    }
  }

  /**
   * Predict war impact
   */
  static async predictImpact(req, res) {
    try {
      const { region, intensity } = req.body;

      const result = await pythonService.predictImpact(region, intensity);
      res.json(ApiResponse.success(result, 'Impact prediction completed successfully'));
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json(ApiResponse.error('Prediction service unavailable', 'PREDICTION_ERROR'));
    }
  }

  /**
   * Generate chart data
   */
  static async generateChartData(req, res) {
    try {
      const { metric, duration } = req.body;

      const result = await pythonService.generateChartData(metric, duration);
      res.json(ApiResponse.success(result, 'Chart data generated successfully'));
    } catch (error) {
      console.error('Chart data error:', error);
      res.status(500).json(ApiResponse.error('Chart data service unavailable', 'CHART_ERROR'));
    }
  }

  /**
   * Check Python service health
   */
  static async checkHealth(req, res) {
    try {
      const health = await pythonService.checkHealth();
      res.json(ApiResponse.success(health, 'Service health retrieved'));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to check service health', 'HEALTH_ERROR'));
    }
  }
}

module.exports = AnalysisController;
