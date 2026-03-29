'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const relatedArticles = [
  {
    id: '1',
    title: 'Impact of War on Oil Prices',
    excerpt: 'Analysis of how geopolitical tensions affect global oil markets and energy security.',
    category: 'Markets',
    slug: 'impact-of-war-on-oil-prices'
  },
  {
    id: '2',
    title: 'Defense Sector Growth During War',
    excerpt: 'Examining the defense industry\'s response to increased global tensions.',
    category: 'Sectors',
    slug: 'defense-sector-growth-during-war'
  },
  {
    id: '3',
    title: 'Global Food Supply Chain Disruptions',
    excerpt: 'How conflict zones impact agricultural production and food security worldwide.',
    category: 'Economy',
    slug: 'global-food-supply-chain-disruptions'
  }
]

export default function RelatedArticles({ currentSlug }) {
  const filteredArticles = relatedArticles.filter(article => article.slug !== currentSlug).slice(0, 3)

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">Related Articles</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/analysis/${article.slug}`}
                className="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all"
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-3">
                  {article.category}
                </span>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                
                <span className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Read article
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}