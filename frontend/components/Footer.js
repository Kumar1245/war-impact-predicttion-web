'use client'

import Link from 'next/link'
import { Scale, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  research: [
    { name: 'Markets', href: '/explore?category=Markets' },
    { name: 'Economy', href: '/explore?category=Economy' },
    { name: 'Sectors', href: '/explore?category=Sectors' },
    { name: 'Geopolitics', href: '/explore?category=Geopolitics' },
    { name: 'Predictions', href: '/explore?category=Predictions' }
  ],
  tools: [
    { name: 'Scenario Analysis', href: '/scenario' },
    { name: 'Explore Research', href: '/explore' },
    { name: 'Latest News', href: '/news' }
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Methodology', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Careers', href: '#' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Disclaimer', href: '#' }
  ]
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'Email', icon: Mail, href: '#' }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Scale className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-serif font-bold text-white">
                War Impact
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Data-driven insights and analysis on how conflicts reshape markets, 
              industries, and economic systems worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Research Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Research</h3>
            <ul className="space-y-2">
              {footerLinks.research.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} War Impact Research Platform. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Data sources: Bloomberg, Reuters, Financial Times, World Bank, IMF
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}