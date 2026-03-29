/**
 * News Routes
 * Defines all news-related API endpoints
 */

const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');

// GET /api/news - Get all news
router.get('/', NewsController.getNews);

// GET /api/news/analyzed - Get news with sentiment analysis
router.get('/analyzed', NewsController.getAnalyzedNews);

// GET /api/news/latest - Get latest news
router.get('/latest', NewsController.getLatestNews);

// GET /api/news/region/:region - Get news by region
router.get('/region/:region', NewsController.getNewsByRegion);

module.exports = router;
