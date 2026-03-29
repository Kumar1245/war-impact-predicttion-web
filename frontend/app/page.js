'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { ArrowRight, TrendingUp, Shield, Globe, LineChart, Newspaper, RefreshCw, Activity } from 'lucide-react'

const featuredArticles = [
  {
    id: '1',
    title: 'Impact of War on Oil Prices',
    excerpt: 'Analysis of how geopolitical tensions affect global oil markets and energy security.',
    category: 'Markets',
    author: 'Dr. Sarah Chen',
    date: 'Dec 15, 2024',
    slug: 'impact-of-war-on-oil-prices'
  },
  {
    id: '2',
    title: 'How Conflict Affects Global Markets',
    excerpt: 'Understanding market volatility during times of geopolitical uncertainty.',
    category: 'Economy',
    author: 'Michael Rodriguez',
    date: 'Dec 14, 2024',
    slug: 'how-conflict-affects-global-markets'
  },
  {
    id: '3',
    title: 'Defense Sector Growth During War',
    excerpt: 'Examining the defense industry\'s response to increased global tensions.',
    category: 'Sectors',
    author: 'Emily Watson',
    date: 'Dec 13, 2024',
    slug: 'defense-sector-growth-during-war'
  }
]

const latestArticles = [
  {
    id: '4',
    title: 'Global Food Supply Chain Disruptions',
    excerpt: 'How conflict zones impact agricultural production and food security worldwide.',
    category: 'Economy',
    author: 'Dr. James Liu',
    date: 'Dec 12, 2024',
    slug: 'global-food-supply-chain-disruptions'
  },
  {
    id: '5',
    title: 'Technology Sector Resilience',
    excerpt: 'Analysis of tech companies adapting to geopolitical challenges.',
    category: 'Sectors',
    author: 'Anna Kowalski',
    date: 'Dec 11, 2024',
    slug: 'technology-sector-resilience'
  },
  {
    id: '6',
    title: 'Emerging Market Vulnerabilities',
    excerpt: 'How developing economies navigate conflict-related economic pressures.',
    category: 'Economy',
    author: 'Carlos Mendez',
    date: 'Dec 10, 2024',
    slug: 'emerging-market-vulnerabilities'
  }
]

const categories = [
  { name: 'Markets', icon: TrendingUp, color: 'blue', description: 'Market analysis and trends' },
  { name: 'Economy', icon: LineChart, color: 'green', description: 'Economic impact studies' },
  { name: 'Sectors', icon: Shield, color: 'purple', description: 'Industry-specific analysis' },
  { name: 'Geopolitics', icon: Globe, color: 'red', description: 'Political risk assessment' },
  { name: 'News', icon: Newspaper, color: 'orange', description: 'Latest news and updates' }
]

export default function Home() {
  const [marketData, setMarketData] = useState(null)
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRealTimeData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch market data from backend
      const marketRes = await fetch('http://localhost:5000/api/market-data')
      const marketJson = await marketRes.json()
      // Extract data from API response format
      setMarketData(marketJson.data || marketJson)

      // Fetch news from backend
      const newsRes = await fetch('http://localhost:5000/api/news')
      const newsJson = await newsRes.json()
      // Extract data from API response format
      setNews(newsJson.data || newsJson)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to fetch real-time data. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRealTimeData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Understand the Impact of War on Global Economy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Data-driven insights and analysis on how conflicts reshape markets, industries, 
              and economic systems worldwide.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              Explore Research
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Real-Time Market Data Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Real-Time Market Data
              </h2>
            </div>
            <button 
              onClick={fetchRealTimeData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <p className="text-sm text-red-500 mt-1">Start backend with: cd backend && npm start</p>
            </div>
          )}

          {!loading && marketData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Market Indices */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Market Indices
                </h3>
                <div className="space-y-3">
                  {marketData.indices.map((index, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{index.name}</span>
                      <div className="text-right">
                        <span className="font-mono text-gray-900 dark:text-white">
                          {index.value.toFixed(2)}
                        </span>
                        <span className={`ml-2 text-sm ${parseFloat(index.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {index.change > 0 ? '+' : ''}{index.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commodities */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-amber-500" />
                  Commodities
                </h3>
                <div className="space-y-3">
                  {marketData.commodities.map((commodity, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{commodity.name}</span>
                      <div className="text-right">
                        <span className="font-mono text-gray-900 dark:text-white">
                          ${commodity.price.toFixed(2)}
                        </span>
                        <span className={`ml-2 text-sm ${parseFloat(commodity.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {commodity.change > 0 ? '+' : ''}{commodity.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currencies */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-500" />
                  Currencies
                </h3>
                <div className="space-y-3">
                  {marketData.currencies.map((currency, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{currency.pair}</span>
                      <div className="text-right">
                        <span className="font-mono text-gray-900 dark:text-white">
                          {currency.rate.toFixed(4)}
                        </span>
                        <span className={`ml-2 text-sm ${parseFloat(currency.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {currency.change > 0 ? '+' : ''}{currency.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && !marketData && (
            <div className="flex items-center justify-center h-48">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading market data...</span>
            </div>
          )}

          {marketData && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Last updated: {new Date(marketData.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      {news && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Newspaper className="w-8 h-8 text-orange-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Latest News
                </h2>
              </div>
              <Link 
                href="/news"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.articles.slice(0, 4).map((article) => (
                <motion.div
                  key={article.id}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      article.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {article.sentiment}
                    </span>
                    <span className="text-xs text-gray-500">{article.region}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.source}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center cursor-pointer"
              >
                <category.icon className={`w-12 h-12 mx-auto mb-4 text-${category.color}-600`} />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Featured Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
            >
              View All Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Latest Research
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay Ahead of the Curve
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get real-time insights on how global conflicts impact markets and economies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scenario"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
            >
              Run Scenario Analysis
            </Link>
            <Link
              href="/news"
              className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-all"
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}