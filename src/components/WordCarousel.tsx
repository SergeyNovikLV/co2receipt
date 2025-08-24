'use client'

import { motion } from 'framer-motion'

export function WordCarousel() {
  const words = ['People', 'Nature', 'Planet']
  return (
    <span className="relative inline-block align-middle h-[1.5em] w-[10.5ch] overflow-hidden">
      <motion.div
        className="absolute inset-0 flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: [0, -24, -48, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'linear' }}
      >
        {words.map((w) => (
          <span key={w} className="block leading-none">{w}</span>
        ))}
      </motion.div>
    </span>
  )
}




