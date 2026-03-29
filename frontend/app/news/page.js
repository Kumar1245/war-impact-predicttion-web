'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Search } from 'lucide-react'

const newsArticles = [
  {
    id: '1',
    title: 'Oil Prices Surge as Tensions Rise in Middle East',
    excerpt: 'Brent crude futures jumped 3% amid escalating geopolitical concerns, with traders pricing in supply disruption risks.',
    category: 'Energy',
    sentiment: 'negative',
    date: 'Dec 15, 2024',
    readTime: '4 min',
    source: 'Reuters'
  },
  {
    id: '2',
    title: 'Global Markets Rally on Diplomatic Optimism',
    excerpt: 'Stock indices across Asia and Europe advance as investors react to positive signals from peace talks.',
    category: 'Markets',
    sentiment: 'positive',
    date: 'Dec 14, 2024',
    readTime: '3 min',
    source: 'Bloomberg'
  },
  {
    id: '3',
    title: 'Defense Companies Report Record Q4 Orders',
    excerpt: 'Major defense contractors announce surge in government contracts amid increased military budgets.',
    category: 'Defense',
    sentiment: 'positive',
    date: 'Dec 14, 2024',
    readTime: '5 min',
    source: 'Financial Times'
  },
  {
    id: '4',
    title: 'UN Food Program Faces Critical Funding Shortage',
    excerpt: 'World Food Programme warns of crisis as humanitarian needs surge in conflict zones.',
    category: 'Humanitarian',
    sentiment: 'negative',
    date: 'Dec 13, 2024',
    readTime: '4 min',
    source: 'Al Jazeera'
  },
  {
    id: '5',
    title: 'Central Banks Hold Rates Amid Uncertainty',
    excerpt: 'Major central banks maintain cautious stance as geopolitical risks weigh on economic outlook.',
    category: 'Economy',
    sentiment: 'neutral',
    date: 'Dec 13, 2024',
    readTime: '6 min',
    source: 'Wall Street Journal'
  },
  {
    id: '6',
    title: 'Gold ETFs See Record Inflows This Quarter',
    excerpt: 'Investors flock to safe-haven assets as geopolitical tensions drive portfolio hedging strategies.',
    category: 'Commodities',
    sentiment: 'positive',
    date: 'Dec 12, 2024',
    readTime: '3 min',
    source: 'CNBC'
  },
  {
    id: '7',
    title: 'Airlines Cancel Routes Amid Rising Fuel Costs',
    excerpt: 'Major carriers reduce flight frequencies as jet fuel prices strain operational budgets.',
    category: 'Transport',
    sentiment: 'negative',
    date: 'Dec 12, 2024',
    readTime: '4 min',
    source: 'Reuters'
  },
  {
    id: '8',
    title: 'Tech Giants Report Stable Q4 Earnings Despite Headwinds',
    excerpt: 'Major technology companies exceed expectations as cloud services offset consumer segment weakness.',
    category: 'Technology',
    sentiment: 'positive',
    date: 'Dec 11, 2024',
    readTime: '5 min',
    source: 'TechCrunch'
  },
  {
    id: '9',
    title: 'Sanctions Impact Trade Flows Between Major Economies',
    excerpt: 'New trade restrictions create ripple effects across global supply chains and manufacturing.',
    category: 'Trade',
    sentiment: 'negative',
    date: 'Dec 11, 2024',
    readTime: '6 min',
    source: 'Financial Times'
  },
  {
    id: '10',
    title: 'Agricultural Futures Volatile on Supply Concerns',
    excerpt: 'Wheat and corn prices fluctuate as investors assess crop production outlook in conflict regions.',
    category: 'Agriculture',
    sentiment: 'neutral',
    date: 'Dec 10, 2024',
    readTime: '4 min',
    source: 'Bloomberg'
  },
  {
    id: '11',
    title: 'NATO Members Agree on Increased Defense Spending',
    excerpt: 'Alliance members commit to higher military budgets in response to evolving security environment.',
    category: 'Geopolitics',
    sentiment: 'positive',
    date: 'Dec 10, 2024',
    readTime: '5 min',
    source: 'BBC News'
  },
  {
    id: '12',
    title: 'Shipping Companies Announce Surcharges Amid Route Disruptions',
    excerpt: 'Major shipping firms implement emergency fees as alternative routes add transit time and costs.',
    category: 'Logistics',
    sentiment: 'negative',
    date: 'Dec 9, 2024',
    readTime: '3 min',
    source: 'Maritime News'
  }
]

const categories = ['All', 'Markets', 'Energy', 'Defense', 'Economy', 'Technology', 'Geopolitics', 'Humanitarian']
const sentiments = ['All', 'positive', 'negative', 'neutral']

const sentimentConfig = {
  positive: {
    label: 'Positive',
    icon: TrendingUp,
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-200'
  },
  negative: {
    label: 'Negative',
    icon: TrendingDown,
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-800 dark:text-red-200'
  },
  neutral: {
    label: 'Neutral',
    icon: Minus,
    color: 'gray',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    textColor: 'text-gray-800 dark:text-gray-200'
  }
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSentiment, setSelectedSentiment] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [newsArticles, setNewsArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch news from backend on mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/news')
        const json = await res.json()
        const newsData = json.data || json
        setNewsArticles(newsData.articles || [])
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const filteredNews = newsArticles.filter(article => {
    if (selectedCategory !== 'All' && article.category !== selectedCategory) return false
    if (selectedSentiment !== 'All' && article.sentiment !== selectedSentiment) return false
    if (searchQuery && !article.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !article.summary?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay updated with the latest developments in global conflict and economic impacts
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sentiment Filter */}
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {sentiments.map(sent => (
                <option key={sent} value={sent}>{sent === 'All' ? 'All Sentiments' : sent.charAt(0).toUpperCase() + sent.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          Showing {filteredNews.length} of {newsArticles.length} articles
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid gap-6">
            {filteredNews.map((article, index) => {
              const sentiment = sentimentConfig[article.sentiment]
              const SentimentIcon = sentiment.icon
              
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Sentiment Badge */}
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sentiment.bgColor} ${sentiment.textColor}`}>
                        <SentimentIcon className="w-4 h-4 mr-1" />
                        {sentiment.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{article.category}</span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : article.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">{article.source}</span>
                      </div>

                      <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {article.summary || article.excerpt}
                      </p>

                      <div className="flex items-center">
                        <button className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center hover:underline">
                          Read more
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No news articles found</p>
            <button
              onClick={() => {setSelectedCategory('All'); setSelectedSentiment('All'); setSearchQuery('')}}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}