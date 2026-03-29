'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, AlertTriangle, Clock, TrendingUp, TrendingDown, RefreshCw, Info } from 'lucide-react'

const regions = [
  { id: 'global', name: 'Global', description: 'Worldwide impact' },
  { id: 'middle-east', name: 'Middle East', description: 'Oil-producing regions' },
  { id: 'europe', name: 'Europe', description: 'NATO members & EU' },
  { id: 'asia-pacific', name: 'Asia-Pacific', description: 'Pacific Rim nations' },
  { id: 'americas', name: 'Americas', description: 'North & South America' },
  { id: 'africa', name: 'Africa', description: 'Continent-wide' }
]

const intensities = [
  { id: 'low', name: 'Low', description: 'Tensions, sanctions', color: 'yellow', multiplier: 0.3 },
  { id: 'medium', name: 'Medium', description: 'Limited conflict', color: 'orange', multiplier: 0.6 },
  { id: 'high', name: 'High', description: 'Active warfare', color: 'red', multiplier: 1.0 },
  { id: 'severe', name: 'Severe', description: 'Major conflict', color: 'purple', multiplier: 1.5 }
]

const durations = [
  { id: '1-month', name: '1 Month', description: 'Short-term crisis' },
  { id: '3-months', name: '3 Months', description: 'Quarter-long' },
  { id: '6-months', name: '6 Months', description: 'Extended conflict' },
  { id: '1-year', name: '1 Year', description: 'Long-term crisis' },
  { id: '2-plus', name: '2+ Years', description: 'Prolonged conflict' }
]

const generateImpacts = (region, intensity, duration) => {
  const baseImpacts = [
    { 
      name: 'Oil Prices', 
      direction: 'up', 
      baseChange: 25, 
      description: 'Supply disruptions and geopolitical risk premium',
      sector: 'Energy'
    },
    { 
      name: 'Gold', 
      direction: 'up', 
      baseChange: 15, 
      description: 'Safe-haven demand increases',
      sector: 'Commodities'
    },
    { 
      name: 'Defense Stocks', 
      direction: 'up', 
      baseChange: 20, 
      description: 'Increased military spending',
      sector: 'Defense'
    },
    { 
      name: 'Market Volatility', 
      direction: 'up', 
      baseChange: 60, 
      description: 'VIX spike and uncertainty',
      sector: 'Markets'
    },
    { 
      name: 'Airlines', 
      direction: 'down', 
      baseChange: 18, 
      description: 'Higher fuel costs and reduced travel',
      sector: 'Transport'
    },
    { 
      name: 'Shipping', 
      direction: 'down', 
      baseChange: 22, 
      description: 'Route disruptions and insurance costs',
      sector: 'Transport'
    },
    { 
      name: 'Bond Yields', 
      direction: 'down', 
      baseChange: 8, 
      description: 'Flight to safety',
      sector: 'Fixed Income'
    },
    { 
      name: 'Emerging Markets', 
      direction: 'down', 
      baseChange: 15, 
      description: 'Capital flight and currency pressure',
      sector: 'Equities'
    },
    { 
      name: 'US Dollar', 
      direction: 'up', 
      baseChange: 8, 
      description: 'Safe-haven currency demand',
      sector: 'FX'
    },
    { 
      name: 'Technology Sector', 
      direction: 'down', 
      baseChange: 12, 
      description: 'Supply chain disruptions',
      sector: 'Equities'
    }
  ]

  const selectedIntensity = intensities.find(i => i.id === intensity)
  const selectedDuration = durations.find(d => d.id === duration)
  const multiplier = selectedIntensity?.multiplier || 0.5
  
  const durationMultiplier = {
    '1-month': 0.5,
    '3-months': 0.7,
    '6-months': 1.0,
    '1-year': 1.3,
    '2-plus': 1.5
  }[duration] || 1

  return baseImpacts.map(impact => {
    const change = Math.round(impact.baseChange * multiplier * durationMultiplier)
    return {
      ...impact,
      change,
      confidence: Math.min(95, 60 + Math.round(multiplier * 20))
    }
  }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
}

export default function ScenarioPage() {
  const [selectedRegion, setSelectedRegion] = useState('global')
  const [selectedIntensity, setSelectedIntensity] = useState('medium')
  const [selectedDuration, setSelectedDuration] = useState('6-months')
  const [showResults, setShowResults] = useState(false)

  const selectedRegionData = regions.find(r => r.id === selectedRegion)
  const selectedIntensityData = intensities.find(i => i.id === selectedIntensity)
  const selectedDurationData = durations.find(d => d.id === selectedDuration)

  const impacts = generateImpacts(selectedRegion, selectedIntensity, selectedDuration)

  const handleAnalyze = () => {
    setShowResults(false)
    setTimeout(() => setShowResults(true), 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Conflict Scenario Analysis</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore potential economic impacts based on different conflict scenarios
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Region Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold">Region</h2>
            </div>
            <div className="space-y-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedRegion === region.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{region.name}</div>
                  <div className={`text-sm ${selectedRegion === region.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {region.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Intensity and Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Conflict Intensity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-bold">Conflict Intensity</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {intensities.map((intensity) => (
                  <button
                    key={intensity.id}
                    onClick={() => setSelectedIntensity(intensity.id)}
                    className={`p-4 rounded-lg text-center transition-all ${
                      selectedIntensity === intensity.id
                        ? `bg-${intensity.color}-600 text-white ring-2 ring-${intensity.color}-400`
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-bold">{intensity.name}</div>
                    <div className="text-xs mt-1 opacity-80">{intensity.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold">Expected Duration</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {durations.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedDuration === duration.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{duration.name}</div>
                    <div className="text-xs mt-1 opacity-80">{duration.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <RefreshCw className="w-6 h-6 mr-2" />
              Analyze Scenario
            </motion.button>
          </motion.div>
        </div>

        {/* Results Section */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Scenario Summary</h2>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Region:</span>
                  <span className="ml-2 font-bold">{selectedRegionData?.name}</span>
                </div>
                <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <span className="text-sm text-orange-600 dark:text-orange-400">Intensity:</span>
                  <span className="ml-2 font-bold">{selectedIntensityData?.name}</span>
                </div>
                <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <span className="text-sm text-purple-600 dark:text-purple-400">Duration:</span>
                  <span className="ml-2 font-bold">{selectedDurationData?.name}</span>
                </div>
              </div>
            </div>

            {/* Impact Cards */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Predicted Market Impacts</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {impacts.map((impact, index) => (
                  <motion.div
                    key={impact.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 ${
                      impact.direction === 'up' ? 'border-green-500' : 'border-red-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{impact.name}</h3>
                      <div className={`flex items-center ${
                        impact.direction === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {impact.direction === 'up' ? (
                          <TrendingUp className="w-5 h-5 mr-1" />
                        ) : (
                          <TrendingDown className="w-5 h-5 mr-1" />
                        )}
                        <span className="font-bold text-lg">
                          {impact.direction === 'up' ? '+' : ''}{impact.change}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {impact.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {impact.sector}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Info className="w-3 h-3 mr-1" />
                        {impact.confidence}% confidence
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer:</strong> This is a simplified model for educational purposes. 
                Actual market impacts depend on numerous factors including market conditions, 
                government responses, and unforeseen events. Past performance does not guarantee future results.
              </p>
            </div>
          </motion.div>
        )}

        {/* Initial State */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Configure Your Scenario</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Select a region, conflict intensity, and expected duration to see predicted economic impacts
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}