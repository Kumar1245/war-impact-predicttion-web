/**
 * Market Routes
 * Defines all market-related API endpoints
 */

const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/marketController');

// GET /api/market-data - Get all market data
router.get('/', MarketController.getMarketData);

// GET /api/market-data/indices/:name - Get specific index
router.get('/indices/:name', MarketController.getIndex);

// GET /api/market-data/commodities/:name - Get commodity data
router.get('/commodities/:name', MarketController.getCommodity);

// GET /api/market-data/currencies/:pair - Get currency pair
router.get('/currencies/:pair', MarketController.getCurrency);

// GET /api/market-data/vix - Get VIX data
router.get('/vix', MarketController.getVIX);

module.exports = router;
