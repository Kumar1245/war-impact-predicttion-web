/**
 * Articles Controller
 * Handles all article-related HTTP requests
 */

const articlesService = require('../services/articlesService');
const ApiResponse = require('../utils/ApiResponse');

class ArticlesController {
  /**
   * Get all articles with optional filtering
   */
  static getAll(req, res) {
    try {
      const { category, author, search, page = 1, limit = 10 } = req.query;
      
      const result = articlesService.getAllArticles({
        category,
        author,
        search,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json(ApiResponse.paginated(
        result.articles,
        page,
        limit,
        result.pagination.total,
        'Articles retrieved successfully'
      ));
    } catch (error) {
      console.error('Error getting articles:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve articles', 'ARTICLES_ERROR'));
    }
  }

  /**
   * Get article by slug
   */
  static getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const article = articlesService.getArticleBySlug(slug);

      if (!article) {
        return res.status(404).json(ApiResponse.notFound('Article'));
      }

      res.json(ApiResponse.success(article, 'Article retrieved successfully'));
    } catch (error) {
      console.error('Error getting article:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve article', 'ARTICLE_ERROR'));
    }
  }

  /**
   * Get related articles
   */
  static getRelated(req, res) {
    try {
      const { slug } = req.params;
      const { limit = 3 } = req.query;
      
      const articles = articlesService.getRelatedArticles(slug, parseInt(limit));

      res.json(ApiResponse.success(articles, 'Related articles retrieved successfully'));
    } catch (error) {
      console.error('Error getting related articles:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve related articles', 'RELATED_ERROR'));
    }
  }

  /**
   * Get article categories
   */
  static getCategories(req, res) {
    try {
      const categories = articlesService.getCategories();
      res.json(ApiResponse.success(categories, 'Categories retrieved successfully'));
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve categories', 'CATEGORIES_ERROR'));
    }
  }

  /**
   * Get latest articles
   */
  static getLatest(req, res) {
    try {
      const { limit = 5 } = req.query;
      const articles = articlesService.getLatestArticles(parseInt(limit));
      res.json(ApiResponse.success(articles, 'Latest articles retrieved successfully'));
    } catch (error) {
      console.error('Error getting latest articles:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve latest articles', 'LATEST_ERROR'));
    }
  }

  /**
   * Get articles by category
   */
  static getByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 10 } = req.query;
      
      const articles = articlesService.getArticlesByCategory(category, parseInt(limit));
      res.json(ApiResponse.success(articles, 'Articles retrieved successfully'));
    } catch (error) {
      console.error('Error getting articles by category:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve articles', 'CATEGORY_ERROR'));
    }
  }
}

module.exports = ArticlesController;
