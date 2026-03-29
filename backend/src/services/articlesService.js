/**
 * Articles Service
 * Handles all article-related business logic
 */

const fs = require('fs');
const path = require('path');

class ArticlesService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/article.json');
  }

  /**
   * Load articles from file
   */
  loadArticles() {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading articles:', error);
      return [];
    }
  }

  /**
   * Get all articles with optional filtering and pagination
   */
  getAllArticles(filters = {}) {
    let articles = this.loadArticles();

    // Filter by category
    if (filters.category) {
      articles = articles.filter(a => a.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by author
    if (filters.author) {
      articles = articles.filter(a => a.author.toLowerCase().includes(filters.author.toLowerCase()));
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.summary.toLowerCase().includes(query)
      );
    }

    // Sort by date
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedArticles = articles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total: articles.length,
        totalPages: Math.ceil(articles.length / limit)
      }
    };
  }

  /**
   * Get article by slug
   */
  getArticleBySlug(slug) {
    const articles = this.loadArticles();
    return articles.find(a => a.slug === slug) || null;
  }

  /**
   * Get related articles based on current article
   */
  getRelatedArticles(slug, limit = 3) {
    const currentArticle = this.getArticleBySlug(slug);
    if (!currentArticle) return [];

    const articles = this.loadArticles();
    
    return articles
      .filter(a => a.slug !== slug && a.category === currentArticle.category)
      .slice(0, limit);
  }

  /**
   * Get article categories
   */
  getCategories() {
    const articles = this.loadArticles();
    const categories = [...new Set(articles.map(a => a.category))];
    return categories;
  }

  /**
   * Get latest articles
   */
  getLatestArticles(limit = 5) {
    const articles = this.loadArticles();
    return articles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  /**
   * Get articles by category
   */
  getArticlesByCategory(category, limit = 10) {
    const articles = this.loadArticles();
    return articles
      .filter(a => a.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}

module.exports = new ArticlesService();
