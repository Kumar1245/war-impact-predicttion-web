/**
 * Python Service
 * Handles communication with Python ML service
 */

const axios = require('axios');

class PythonService {
  constructor() {
    this.baseUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
    this.timeout = 30000; // 30 seconds timeout
  }

  /**
   * Analyze text (sentiment/summary)
   */
  async analyze(text, type = 'sentiment') {
    try {
      const response = await axios.post(`${this.baseUrl}/analyze`, {
        text,
        type
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Python analysis error:', error.message);
      throw new Error(`Analysis service unavailable: ${error.message}`);
    }
  }

  /**
   * Predict war impact
   */
  async predictImpact(region, intensity) {
    try {
      const response = await axios.post(`${this.baseUrl}/predict-impact`, {
        region,
        intensity
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Python prediction error:', error.message);
      throw new Error(`Prediction service unavailable: ${error.message}`);
    }
  }

  /**
   * Generate chart data
   */
  async generateChartData(metric, duration) {
    try {
      const response = await axios.post(`${this.baseUrl}/generate-chart-data`, {
        metric,
        duration
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Python chart data error:', error.message);
      throw new Error(`Chart data service unavailable: ${error.message}`);
    }
  }

  /**
   * Check service health
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      return {
        status: 'unavailable',
        error: error.message
      };
    }
  }

  /**
   * Get sentiment analysis only
   */
  async getSentiment(text) {
    return this.analyze(text, 'sentiment');
  }

  /**
   * Get summary only
   */
  async getSummary(text) {
    return this.analyze(text, 'summary');
  }

  /**
   * Get both sentiment and summary
   */
  async getAnalysis(text) {
    return this.analyze(text, 'both');
  }
}

module.exports = new PythonService();
