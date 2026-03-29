'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, User, Tag, Share2, Bookmark, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import RelatedArticles from '@/components/RelatedArticles'
import TableOfContents from '@/components/TableOfContents'

const articlesData = {
  'impact-of-war-on-oil-prices': {
    title: 'Impact of War on Oil Prices',
    author: 'Dr. Sarah Chen',
    date: 'December 15, 2024',
    category: 'Markets',
    readTime: '8 min read',
    content: {
      overview: 'Geopolitical tensions in major oil-producing regions have historically led to significant volatility in crude oil prices. This analysis examines the relationship between conflict events and oil market dynamics, focusing on supply chain disruptions, strategic reserves, and long-term price trends. The data reveals that oil prices typically experience their most dramatic fluctuations in the early stages of conflict, with subsequent stabilization as markets adjust to new realities.',
      upDown: {
        increases: ['Oil prices', 'Energy stocks', 'Defense stocks', 'Gold', 'Natural gas'],
        decreases: ['Airlines', 'Shipping', 'Manufacturing', 'Consumer goods', 'Tourism']
      },
      chartData: [
        { month: 'Jan', price: 78 },
        { month: 'Feb', price: 82 },
        { month: 'Mar', price: 95 },
        { month: 'Apr', price: 112 },
        { month: 'May', price: 108 },
        { month: 'Jun', price: 104 }
      ],
      sectorImpact: [
        { sector: 'Energy', impact: 'Positive', change: '+15%', description: 'Increased demand and supply constraints' },
        { sector: 'Airlines', impact: 'Negative', change: '-12%', description: 'Higher fuel costs impact margins' },
        { sector: 'Defense', impact: 'Positive', change: '+8%', description: 'Increased government spending' },
        { sector: 'Renewables', impact: 'Positive', change: '+5%', description: 'Accelerated energy transition' },
        { sector: 'Shipping', impact: 'Negative', change: '-18%', description: 'Fuel costs and route disruptions' }
      ],
      keyInsights: [
        'Oil prices typically spike 20-30% within the first month of conflict onset',
        'Market volatility increases by 40% during geopolitical crises',
        'Strategic petroleum reserves help stabilize markets but have limited long-term impact',
        'Alternative energy investments see increased attention during supply disruptions'
      ],
      conclusion: 'While conflicts create immediate price shocks, the long-term impact depends on conflict duration, global response, and the acceleration of energy transition policies. Markets are adapting with diversified supply chains and strategic reserves.'
    }
  },
  'how-conflict-affects-global-markets': {
    title: 'How Conflict Affects Global Markets',
    author: 'Michael Rodriguez',
    date: 'December 14, 2024',
    category: 'Economy',
    readTime: '6 min read',
    content: {
      overview: 'Global financial markets react swiftly to geopolitical tensions, with effects cascading across asset classes and regions. This analysis explores historical patterns and identifies key indicators that investors should monitor during periods of uncertainty.',
      upDown: {
        increases: ['Gold', 'USD', 'Defense stocks', 'Government bonds', 'Volatility index'],
        decreases: ['Equities', 'Emerging markets', 'Commodities (non-energy)', 'Tourism stocks', 'Luxury goods']
      },
      chartData: [
        { month: 'Jan', volatility: 12 },
        { month: 'Feb', volatility: 15 },
        { month: 'Mar', volatility: 28 },
        { month: 'Apr', volatility: 32 },
        { month: 'May', volatility: 25 },
        { month: 'Jun', volatility: 18 }
      ],
      sectorImpact: [
        { sector: 'Financial', impact: 'Mixed', change: '-5%', description: 'Increased volatility but safe-haven flows' },
        { sector: 'Technology', impact: 'Negative', change: '-8%', description: 'Supply chain disruptions' },
        { sector: 'Agriculture', impact: 'Negative', change: '-10%', description: 'Trade route disruptions' },
        { sector: 'Healthcare', impact: 'Positive', change: '+3%', description: 'Increased demand during crises' }
      ],
      keyInsights: [
        'Market volatility index (VIX) increases 50-80% during conflicts',
        'Flight to safety drives government bond yields down 0.5-1.0%',
        'Currency markets see increased hedging activity',
        'Technology sector faces additional headwinds from supply chain issues'
      ],
      conclusion: 'Markets demonstrate resilience over time, but short-term volatility requires careful portfolio management. Diversification and defensive positioning remain key strategies during geopolitical uncertainty.'
    }
  },
  'defense-sector-growth-during-war': {
    title: 'Defense Sector Growth During War',
    author: 'Emily Watson',
    date: 'December 13, 2024',
    category: 'Sectors',
    readTime: '7 min read',
    content: {
      overview: 'The defense industry traditionally benefits from increased geopolitical tensions and active conflicts. This analysis examines the mechanisms driving defense sector growth, including government spending increases, modernization programs, and the strategic importance of military capabilities.',
      upDown: {
        increases: ['Defense contractors', 'Military equipment manufacturers', 'Cybersecurity firms', 'Intelligence services', 'Strategic materials'],
        decreases: ['Civil aviation', 'Defense contractors (consumer)', 'Tourism', 'Retail (luxury)']
      },
      chartData: [
        { month: 'Jan', index: 100 },
        { month: 'Feb', index: 105 },
        { month: 'Mar', index: 118 },
        { month: 'Apr', index: 125 },
        { month: 'May', index: 132 },
        { month: 'Jun', index: 140 }
      ],
      sectorImpact: [
        { sector: 'Defense Contractors', impact: 'Positive', change: '+25%', description: 'Increased government contracts' },
        { sector: 'Aerospace', impact: 'Positive', change: '+15%', description: 'Military aircraft demand' },
        { sector: 'Electronics', impact: 'Positive', change: '+10%', description: 'Defense electronics demand' },
        { sector: 'Commercial Airlines', impact: 'Negative', change: '-20%', description: 'Reduced travel demand' }
      ],
      keyInsights: [
        'Defense budgets typically increase 15-30% during active conflicts',
        'Smaller, specialized defense contractors often see larger percentage gains',
        'Long-term contracts provide revenue visibility for major defense companies',
        'Research and development spending increases in preparation for future conflicts'
      ],
      conclusion: 'The defense sector remains a traditional beneficiary of geopolitical instability, though investors should consider the ethical implications and the potential for diplomatic resolutions that could reduce long-term demand.'
    }
  },
  'global-food-supply-chain-disruptions': {
    title: 'Global Food Supply Chain Disruptions',
    author: 'Dr. James Liu',
    date: 'December 12, 2024',
    category: 'Economy',
    readTime: '9 min read',
    content: {
      overview: 'Conflicts in major agricultural regions can severely disrupt global food supply chains, leading to price spikes and food insecurity in vulnerable regions. This analysis examines the interconnected nature of global food systems and their vulnerability to geopolitical disruptions.',
      upDown: {
        increases: ['Wheat prices', 'Fertilizer costs', 'Food inflation', 'Agricultural stocks', 'Alternative protein'],
        decreases: ['Restaurant chains', 'Food processors', 'Consumer discretionary', 'Livestock producers']
      },
      chartData: [
        { month: 'Jan', index: 100 },
        { month: 'Feb', index: 108 },
        { month: 'Mar', index: 125 },
        { month: 'Apr', index: 138 },
        { month: 'May', index: 130 },
        { month: 'Jun', index: 122 }
      ],
      sectorImpact: [
        { sector: 'Agriculture', impact: 'Positive', change: '+12%', description: 'Higher commodity prices' },
        { sector: 'Food Processing', impact: 'Negative', change: '-8%', description: 'Input cost pressures' },
        { sector: 'Retail', impact: 'Mixed', change: '+2%', description: 'Higher prices but stable demand' },
        { sector: 'Logistics', impact: 'Negative', change: '-15%', description: 'Route disruptions' }
      ],
      keyInsights: [
        'Ukraine conflict caused wheat prices to surge over 40% in 2022',
        'Fertilizer costs rose 30% due to supply chain disruptions',
        'Food-insecure regions face heightened risk during conflicts',
        'Alternative food sources and vertical farming see increased investment'
      ],
      conclusion: 'Food security remains a critical concern during geopolitical conflicts. Diversification of food sources and strengthening of domestic agricultural capabilities are essential for reducing vulnerability to supply chain disruptions.'
    }
  },
  'technology-sector-resilience': {
    title: 'Technology Sector Resilience',
    author: 'Anna Kowalski',
    date: 'December 11, 2024',
    category: 'Sectors',
    readTime: '6 min read',
    content: {
      overview: 'The technology sector faces unique challenges during geopolitical conflicts, including supply chain disruptions, regulatory changes, and shifting investor sentiment. This analysis evaluates how tech companies adapt and which sub-sectors demonstrate resilience.',
      upDown: {
        increases: ['Cybersecurity', 'Cloud computing', 'Semiconductors (defense)', 'Communication equipment', 'AI/ML'],
        decreases: ['Consumer electronics', 'E-commerce', 'Social media', 'Hardware manufacturers', 'Startups']
      },
      chartData: [
        { month: 'Jan', index: 100 },
        { month: 'Feb', index: 95 },
        { month: 'Mar', index: 88 },
        { month: 'Apr', index: 92 },
        { month: 'May', index: 98 },
        { month: 'Jun', index: 105 }
      ],
      sectorImpact: [
        { sector: 'Cybersecurity', impact: 'Positive', change: '+18%', description: 'Increased security spending' },
        { sector: 'Cloud Services', impact: 'Positive', change: '+8%', description: 'Remote work demand' },
        { sector: 'Semiconductors', impact: 'Mixed', change: '+3%', description: 'Supply constraints continue' },
        { sector: 'Consumer Tech', impact: 'Negative', change: '-12%', description: 'Reduced consumer spending' }
      ],
      keyInsights: [
        'Cybersecurity spending increases 15-20% during geopolitical tensions',
        'Semiconductor shortages persist due to concentrated manufacturing',
        'Cloud computing demand rises as companies prioritize digital infrastructure',
        'Tech decoupling between major powers creates market fragmentation'
      ],
      conclusion: 'The technology sector shows resilience through diversification, with cybersecurity and cloud computing leading growth. However, supply chain vulnerabilities and regulatory fragmentation remain significant concerns.'
    }
  },
  'emerging-market-vulnerabilities': {
    title: 'Emerging Market Vulnerabilities',
    author: 'Carlos Mendez',
    date: 'December 10, 2024',
    category: 'Economy',
    readTime: '8 min read',
    content: {
      overview: 'Emerging markets face heightened vulnerabilities during geopolitical crises, including capital flight, currency depreciation, and reduced access to global financing. This analysis examines which emerging markets are most at risk and strategies for mitigation.',
      upDown: {
        increases: ['Currency hedging costs', 'Debt restructuring needs', 'Food imports', 'Refugee costs', 'Military spending'],
        decreases: ['Foreign direct investment', 'Exports', 'Currency values', 'Foreign reserves', 'Credit ratings']
      },
      chartData: [
        { month: 'Jan', risk: 45 },
        { month: 'Feb', risk: 52 },
        { month: 'Mar', risk: 68 },
        { month: 'Apr', risk: 75 },
        { month: 'May', risk: 70 },
        { month: 'Jun', risk: 65 }
      ],
      sectorImpact: [
        { sector: 'Banking', impact: 'Negative', change: '-10%', description: 'NPL increases' },
        { sector: 'Exports', impact: 'Negative', change: '-15%', description: 'Demand reduction' },
        { sector: 'Real Estate', impact: 'Negative', change: '-12%', description: 'Capital flight' },
        { sector: 'Commodities', impact: 'Positive', change: '+8%', description: 'Price increases' }
      ],
      keyInsights: [
        'Emerging market currencies depreciate 10-20% on average during conflicts',
        'Capital outflows from emerging markets can reach $50 billion monthly',
        'Countries with strong commodity exports tend to weather crises better',
        'IMF assistance requests increase significantly during geopolitical crises'
      ],
      conclusion: 'Emerging markets require robust contingency plans and financial buffers to navigate geopolitical crises. Regional cooperation and diversified trade relationships can reduce vulnerability to individual country conflicts.'
    }
  }
}

export default function AnalysisPage() {
  const params = useParams()
  const slug = params.slug
  const article = articlesData[slug]

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The article you are looking for does not exist.</p>
          <a href="/explore" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse All Articles
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <TableOfContents sections={[
        { id: 'overview', title: 'Overview' },
        { id: 'impact', title: 'What Goes Up/Down' },
        { id: 'trends', title: 'Trend Analysis' },
        { id: 'sectors', title: 'Sector Impact' },
        { id: 'insights', title: 'Key Insights' },
        { id: 'conclusion', title: 'Conclusion' }
      ]} />
      
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {article.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{article.date}</span>
            </div>
            <button className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Bookmark size={18} />
              <span>Save</span>
            </button>
          </div>
        </motion.div>

        {/* Section 1: Overview */}
        <motion.section
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Overview</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {article.content.overview}
          </p>
        </motion.section>

        {/* Section 2: What Goes Up / Down */}
        <motion.section
          id="impact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">What Goes Up / Down</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Increases
              </h3>
              <ul className="space-y-2">
                {article.content.upDown.increases.map((item, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-3 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Decreases
              </h3>
              <ul className="space-y-2">
                {article.content.upDown.decreases.map((item, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Data Visualization */}
        <motion.section
          id="trends"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Trend Analysis</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={article.content.chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={slug === 'how-conflict-affects-global-markets' ? 'volatility' : 
                          slug === 'defense-sector-growth-during-war' ? 'index' :
                          slug === 'global-food-supply-chain-disruptions' ? 'index' :
                          slug === 'technology-sector-resilience' ? 'index' :
                          slug === 'emerging-market-vulnerabilities' ? 'risk' : 'price'} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              Historical trend analysis over the past 6 months
            </p>
          </div>
        </motion.section>

        {/* Section 4: Sector Impact */}
        <motion.section
          id="sectors"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Sector Impact</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {article.content.sectorImpact.map((sector, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{sector.sector}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sector.impact === 'Positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        sector.impact === 'Negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {sector.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{sector.change}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{sector.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Section 5: Key Insights */}
        <motion.section
          id="insights"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 scroll-mt-24"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Key Insights</h2>
          <ul className="space-y-4">
            {article.content.keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 text-lg">{insight}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Section 6: Conclusion */}
        <motion.section
          id="conclusion"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Conclusion</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {article.content.conclusion}
          </p>
        </motion.section>

        {/* Related Articles */}
        <RelatedArticles currentSlug={slug} />
      </article>
    </div>
  )
}