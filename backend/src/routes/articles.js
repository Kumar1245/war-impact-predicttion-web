/**
 * Articles Routes
 * Defines all article-related API endpoints
 */

const express = require('express');
const router = express.Router();
const ArticlesController = require('../controllers/articlesController');

// GET /api/articles - Get all articles with optional filtering
router.get('/', ArticlesController.getAll);

// GET /api/articles/categories - Get all categories
router.get('/categories', ArticlesController.getCategories);

// GET /api/articles/latest - Get latest articles
router.get('/latest', ArticlesController.getLatest);

// GET /api/articles/category/:category - Get articles by category
router.get('/category/:category', ArticlesController.getByCategory);

// GET /api/articles/:slug - Get article by slug
router.get('/:slug', ArticlesController.getBySlug);

// GET /api/articles/:slug/related - Get related articles
router.get('/:slug/related', ArticlesController.getRelated);

module.exports = router;
