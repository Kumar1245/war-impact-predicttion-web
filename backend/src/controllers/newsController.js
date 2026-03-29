/**
 * News Controller
 * Handles all news-related HTTP requests
 */

const newsService = require('../services/newsService');
const ApiResponse = require('../utils/ApiResponse');

class NewsController {
  /**
   * Get all news
   */
  static async getNews(req, res) {
    try {
      const data = await newsService.getNews();
      res.json(ApiResponse.success(data, 'News retrieved successfully'));
    } catch (error) {
      console.error('Error getting news:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve news', 'NEWS_ERROR'));
    }
  }

  /**
   * Get analyzed news with sentiment
   */
  static async getAnalyzedNews(req, res) {
    try {
      const data = await newsService.getAnalyzedNews();
      res.json(ApiResponse.success(data, 'Analyzed news retrieved successfully'));
    } catch (error) {
      console.error('Error getting analyzed news:', error);
      res.status(500).json(ApiResponse.error('Failed to analyze news', 'ANALYSIS_ERROR'));
    }
  }

  /**
   * Get news by region
   */
  static async getNewsByRegion(req, res) {
    try {
      const { region } = req.params;
      const data = await newsService.getNewsByRegion(region);
      res.json(ApiResponse.success(data, 'News retrieved successfully'));
    } catch (error) {
      console.error('Error getting news by region:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve news', 'REGION_ERROR'));
    }
  }

  /**
   * Get latest news
   */
  static async getLatestNews(req, res) {
    try {
      const { limit = 5 } = req.query;
      const data = await newsService.getLatestNews(parseInt(limit));
      res.json(ApiResponse.success(data, 'Latest news retrieved successfully'));
    } catch (error) {
      console.error('Error getting latest news:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve latest news', 'LATEST_ERROR'));
    }
  }
}

module.exports = NewsController;
