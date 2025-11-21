'use client'

import { motion } from 'framer-motion'
import Image from 'next/image' // ← Add this import

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            {/* Logo */}
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="EyeGuess Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">EyeGuess</span>
          </motion.div>
          
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            {['Packages', 'Features', 'Testimonials'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item}
              </motion.a>
            ))}
          </motion.nav>
        </div>
      </div>
    </motion.header>
  )
}