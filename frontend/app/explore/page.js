'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ArticleCard from '@/components/ArticleCard'
import { Search, Filter, X } from 'lucide-react'

const articles = [
  {
    id: '1',
    title: 'Impact of War on Oil Prices',
    excerpt: 'Analysis of how geopolitical tensions affect global oil markets and energy security.',
    category: 'Markets',
    region: 'Global',
    impactType: 'Economic',
    author: 'Dr. Sarah Chen',
    date: 'Dec 15, 2024',
    slug: 'impact-of-war-on-oil-prices'
  },
  {
    id: '2',
    title: 'How Conflict Affects Global Markets',
    excerpt: 'Understanding market volatility during times of geopolitical uncertainty.',
    category: 'Economy',
    region: 'Global',
    impactType: 'Market',
    author: 'Michael Rodriguez',
    date: 'Dec 14, 2024',
    slug: 'how-conflict-affects-global-markets'
  },
  {
    id: '3',
    title: 'Defense Sector Growth During War',
    excerpt: 'Examining the defense industry\'s response to increased global tensions.',
    category: 'Sectors',
    region: 'Global',
    impactType: 'Economic',
    author: 'Emily Watson',
    date: 'Dec 13, 2024',
    slug: 'defense-sector-growth-during-war'
  },
  {
    id: '4',
    title: 'Global Food Supply Chain Disruptions',
    excerpt: 'How conflict zones impact agricultural production and food security worldwide.',
    category: 'Economy',
    region: 'Middle East',
    impactType: 'Social',
    author: 'Dr. James Liu',
    date: 'Dec 12, 2024',
    slug: 'global-food-supply-chain-disruptions'
  },
  {
    id: '5',
    title: 'Technology Sector Resilience',
    excerpt: 'Analysis of tech companies adapting to geopolitical challenges.',
    category: 'Sectors',
    region: 'Global',
    impactType: 'Economic',
    author: 'Anna Kowalski',
    date: 'Dec 11, 2024',
    slug: 'technology-sector-resilience'
  },
  {
    id: '6',
    title: 'Emerging Market Vulnerabilities',
    excerpt: 'How developing economies navigate conflict-related economic pressures.',
    category: 'Economy',
    region: 'Asia-Pacific',
    impactType: 'Economic',
    author: 'Carlos Mendez',
    date: 'Dec 10, 2024',
    slug: 'emerging-market-vulnerabilities'
  },
  {
    id: '7',
    title: 'Why Gold Rises During Conflict',
    excerpt: 'Historical analysis of gold as a safe-haven asset during geopolitical crises.',
    category: 'Markets',
    region: 'Global',
    impactType: 'Market',
    author: 'Robert Williams',
    date: 'Dec 9, 2024',
    slug: 'why-gold-rises-during-conflict'
  },
  {
    id: '8',
    title: 'Airline Industry Collapse During War',
    excerpt: 'Case study on how the aviation sector suffers during active conflicts.',
    category: 'Sectors',
    region: 'Europe',
    impactType: 'Economic',
    author: 'Maria Garcia',
    date: 'Dec 8, 2024',
    slug: 'airline-industry-collapse-during-war'
  },
  {
    id: '9',
    title: 'Cryptocurrency as War Hedge',
    excerpt: 'Exploring digital assets as alternative stores of value during crises.',
    category: 'Markets',
    region: 'Global',
    impactType: 'Market',
    author: 'David Kim',
    date: 'Dec 7, 2024',
    slug: 'cryptocurrency-as-war-hedge'
  },
  {
    id: '10',
    title: 'Semiconductor Supply Chain Warfare',
    excerpt: 'How chip shortages reshape global trade dynamics during tensions.',
    category: 'Sectors',
    region: 'Asia-Pacific',
    impactType: 'Geopolitical',
    author: 'Jennifer Lee',
    date: 'Dec 6, 2024',
    slug: 'semiconductor-supply-chain-warfare'
  },
  {
    id: '11',
    title: 'NATO Defense Spending Analysis',
    excerpt: 'Trends in military budgets across alliance members during crisis periods.',
    category: 'Geopolitics',
    region: 'Europe',
    impactType: 'Geopolitical',
    author: 'Thomas Brown',
    date: 'Dec 5, 2024',
    slug: 'nato-defense-spending-analysis'
  },
  {
    id: '12',
    title: 'Economic Predictions for 2025',
    excerpt: 'Forecasting market trends based on current geopolitical trajectories.',
    category: 'Predictions',
    region: 'Global',
    impactType: 'Economic',
    author: 'Dr. Sarah Chen',
    date: 'Dec 4, 2024',
    slug: 'economic-predictions-for-2025'
  }
]

const categories = ['All', 'Markets', 'Economy', 'Sectors', 'Geopolitics', 'Predictions']
const regions = ['All', 'Global', 'Middle East', 'Europe', 'Asia-Pacific', 'Americas']
const impactTypes = ['All', 'Economic', 'Market', 'Social', 'Geopolitical']

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedImpact, setSelectedImpact] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredArticles = articles.filter(article => {
    if (selectedCategory !== 'All' && article.category !== selectedCategory) return false
    if (selectedRegion !== 'All' && article.region !== selectedRegion) return false
    if (selectedImpact !== 'All' && article.impactType !== selectedImpact) return false
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedRegion('All')
    setSelectedImpact('All')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedCategory !== 'All' || selectedRegion !== 'All' || 
                          selectedImpact !== 'All' || searchQuery !== ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Explore Research</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our comprehensive collection of war impact analysis
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {[selectedCategory, selectedRegion, selectedImpact, searchQuery].filter(f => f !== '' && f !== 'All').length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {regions.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                {/* Impact Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Impact Type
                  </label>
                  <select
                    value={selectedImpact}
                    onChange={(e) => setSelectedImpact(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {impactTypes.map(imp => (
                      <option key={imp} value={imp}>{imp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No articles found matching your criteria</p>
            <button
              onClick={clearFilters}
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