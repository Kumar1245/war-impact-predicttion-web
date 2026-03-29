/**
 * News Service
 * Handles all news related business logic
 * Supports NewsAPI for real news when API key is configured
 */

const axios = require('axios');

class NewsService {
  constructor() {
    this.cache = {
      data: null,
      timestamp: null
    };
    this.cacheDuration = 10 * 60 * 1000; // 10 minutes
    this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.newsApiBaseUrl = 'https://newsapi.org/v2';
  }

  /**
   * Fetch real news from NewsAPI
   */
  async fetchFromNewsAPI(query = 'war OR conflict OR military OR geopolitical') {
    if (!this.newsApiKey) {
      return null;
    }

    try {
      const response = await axios.get(`${this.newsApiBaseUrl}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: this.newsApiKey
        },
        timeout: 10000
      });

      return response.data.articles.map((article, index) => ({
        id: index + 1,
        title: article.title,
        summary: article.description || article.content,
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        imageUrl: article.urlToImage,
        region: this.detectRegion(article.title + ' ' + (article.description || '')),
        sentiment: 'neutral'
      }));
    } catch (error) {
      console.error('NewsAPI error:', error.message);
      return null;
    }
  }

  /**
   * Detect region from news text
   */
  detectRegion(text) {
    const textLower = text.toLowerCase();
    
    const regionKeywords = {
      'Middle East': ['middle east', 'iran', 'iraq', 'syria', 'israel', 'palestine', 'yemen', 'saudi'],
      'Europe': ['europe', 'ukraine', 'russia', 'nato', 'poland', 'germany', 'france', 'britain'],
      'Asia': ['china', 'taiwan', 'korea', 'japan', 'india', 'pakistan', 'asia'],
      'Americas': ['usa', 'america', 'canada', 'mexico', 'brazil', 'latin america'],
      'Africa': ['africa', 'sudan', 'nigeria', 'congo', 'somalia']
    };

    for (const [region, keywords] of Object.entries(regionKeywords)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return region;
      }
    }
    
    return 'Global';
  }

  /**
   * Generate mock news data (fallback)
   */
  generateNews() {
    const newsArticles = [
      {
        id: 1,
        title: "Global Markets React to Escalating Tensions",
        summary: "Stock markets worldwide show increased volatility as geopolitical concerns mount.",
        source: "Financial Times",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative",
        region: "Global"
      },
      {
        id: 2,
        title: "Oil Prices Surge on Supply Concerns",
        summary: "Crude oil prices jump 3% amid ongoing supply chain disruptions in key regions.",
        source: "Reuters",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        sentiment: "neutral",
        region: "Middle East"
      },
      {
        id: 3,
        title: "Central Banks Signal Policy Shift",
        summary: "Major central banks indicate potential interest rate adjustments amid uncertainty.",
        source: "Bloomberg",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        sentiment: "neutral",
        region: "Global"
      },
      {
        id: 4,
        title: "Defense Spending Reaches New High",
        summary: "NATO members increase defense budgets amid heightened security concerns.",
        source: "Wall Street Journal",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        sentiment: "positive",
        region: "Europe"
      },
      {
        id: 5,
        title: "Humanitarian Crisis Deepens",
        summary: "International organizations appeal for increased aid as civilian impacts grow.",
        source: "Al Jazeera",
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative",
        region: "Middle East"
      },
      {
        id: 6,
        title: "Supply Chain Disruptions Impact Manufacturing",
        summary: "Global manufacturing faces continued challenges from logistics disruptions.",
        source: "Economist",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative",
        region: "Global"
      },
      {
        id: 7,
        title: "Energy Transition Accelerates",
        summary: "Renewable energy investments surge as countries seek energy independence.",
        source: "Financial Times",
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        sentiment: "positive",
        region: "Global"
      },
      {
        id: 8,
        title: "Currency Markets Show Increased Volatility",
        summary: "FX traders hedge positions as uncertainty drives currency movements.",
        source: "Reuters",
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        sentiment: "neutral",
        region: "Global"
      }
    ];

    return {
      timestamp: new Date().toISOString(),
      source: 'mock',
      articles: newsArticles
    };
  }

  /**
   * Get news with caching - tries NewsAPI first, falls back to mock
   */
  async getNews() {
    const now = Date.now();

    // Return cached data if available and not expired
    if (this.cache.data && this.cache.timestamp && 
        (now - this.cache.timestamp) < this.cacheDuration) {
      return this.cache.data;
    }

    let newsData;

    // Try to fetch from NewsAPI
    const realNews = await this.fetchFromNewsAPI();
    
    if (realNews && realNews.length > 0) {
      newsData = {
        timestamp: new Date().toISOString(),
        source: 'newsapi',
        articles: realNews
      };
    } else {
      // Fall back to mock data
      console.log('Using mock news data (NewsAPI not configured)');
      newsData = this.generateNews();
    }

    // Update cache
    this.cache = {
      data: newsData,
      timestamp: now
    };

    return newsData;
  }

  /**
   * Analyze news sentiment using Python service
   */
  async getAnalyzedNews() {
    try {
      const news = await this.getNews();

      // Analyze each article's sentiment via Python service
      const analyzedNews = await Promise.all(
        news.articles.map(async (article) => {
          try {
            const response = await axios.post(`${this.pythonServiceUrl}/analyze`, {
              text: article.title + ' ' + (article.summary || ''),
              type: 'sentiment'
            }, {
              timeout: 5000
            });
            return {
              ...article,
              sentimentScore: response.data.sentiment
            };
          } catch (err) {
            return { ...article, sentimentScore: null };
          }
        })
      );

      return {
        ...news,
        articles: analyzedNews
      };
    } catch (error) {
      console.error('Error analyzing news:', error);
      throw error;
    }
  }

  /**
   * Get news by region
   */
  async getNewsByRegion(region) {
    const news = await this.getNews();
    return {
      ...news,
      articles: news.articles.filter(a => a.region.toLowerCase() === region.toLowerCase())
    };
  }

  /**
   * Get latest news
   */
  async getLatestNews(limit = 5) {
    const news = await this.getNews();
    return {
      ...news,
      articles: news.articles.slice(0, limit)
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {
      data: null,
      timestamp: null
    };
  }
}

module.exports = new NewsService();
