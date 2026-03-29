/**
 * Market Controller
 * Handles all market-related HTTP requests
 */

const marketService = require('../services/marketService');
const ApiResponse = require('../utils/ApiResponse');

class MarketController {
  /**
   * Get all market data
   */
  static async getMarketData(req, res) {
    try {
      const data = await marketService.getMarketData();
      res.json(ApiResponse.success(data, 'Market data retrieved successfully'));
    } catch (error) {
      console.error('Error getting market data:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve market data', 'MARKET_ERROR'));
    }
  }

  /**
   * Get specific market index
   */
  static async getIndex(req, res) {
    try {
      const { name } = req.params;
      const index = await marketService.getIndexByName(name);

      if (!index) {
        return res.status(404).json(ApiResponse.notFound('Market index'));
      }

      res.json(ApiResponse.success(index, 'Index retrieved successfully'));
    } catch (error) {
      console.error('Error getting index:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve index', 'INDEX_ERROR'));
    }
  }

  /**
   * Get commodity data
   */
  static async getCommodity(req, res) {
    try {
      const { name } = req.params;
      const commodity = await marketService.getCommodityByName(name);

      if (!commodity) {
        return res.status(404).json(ApiResponse.notFound('Commodity'));
      }

      res.json(ApiResponse.success(commodity, 'Commodity retrieved successfully'));
    } catch (error) {
      console.error('Error getting commodity:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve commodity', 'COMMODITY_ERROR'));
    }
  }

  /**
   * Get currency pair
   */
  static async getCurrency(req, res) {
    try {
      const { pair } = req.params;
      const currency = await marketService.getCurrencyPair(pair);

      if (!currency) {
        return res.status(404).json(ApiResponse.notFound('Currency pair'));
      }

      res.json(ApiResponse.success(currency, 'Currency pair retrieved successfully'));
    } catch (error) {
      console.error('Error getting currency:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve currency', 'CURRENCY_ERROR'));
    }
  }

  /**
   * Get VIX data
   */
  static async getVIX(req, res) {
    try {
      const data = await marketService.getMarketData();
      res.json(ApiResponse.success(data.volatility, 'VIX data retrieved successfully'));
    } catch (error) {
      console.error('Error getting VIX:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve VIX data', 'VIX_ERROR'));
    }
  }
}

module.exports = MarketController;
