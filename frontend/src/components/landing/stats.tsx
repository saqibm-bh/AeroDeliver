"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    { number: "90%", label: "Drone Deliveries", delay: 0 },
    { number: "500+", label: "Industrial Sites", delay: 0.1 },
    { number: "100%", label: "Success Rate", delay: 0.2 },
    { number: "50kg", label: "Max Payload", delay: 0.3 },
  ]

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6" ref={ref}>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
              <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
