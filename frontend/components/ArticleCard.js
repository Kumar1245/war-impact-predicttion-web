'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'

export default function ArticleCard({ article }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <Link href={`/analysis/${article.slug}`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {article.category}
            </span>
          </div>
          
          <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 space-x-4">
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}