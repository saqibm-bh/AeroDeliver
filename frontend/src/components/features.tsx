"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Zap, Shield, Leaf, Clock, MapPin, Smartphone, Bike, Route } from "lucide-react"

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const features = [
    {
      icon: Zap,
      title: "Drone-First Delivery",
      description:
        "Primary focus on autonomous drone delivery for 90% of industrial operations with 15-minute average delivery time",
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description:
        "Advanced encryption, GPS tracking and secure handling protocols for sensitive industrial equipment via both air and ground",
    },
    {
      icon: Bike,
      title: "Hybrid Delivery Network",
      description:
        "Smart routing system combining drone delivery with rider backup for restricted airspace or weather conditions",
    },
    {
      icon: Clock,
      title: "24/7 Multi-Modal Operations",
      description:
        "Round-the-clock delivery service using drones as primary method, with rider support for specialized deliveries",
    },
    {
      icon: MapPin,
      title: "Precision Landing & Routing",
      description:
        "Millimeter-accurate drone delivery to industrial sites, with intelligent rider dispatch for complex locations",
    },
    {
      icon: Route,
      title: "Intelligent Fleet Management",
      description:
        "AI-powered system automatically selects optimal delivery method - drone priority with rider fallback options",
    },
    {
      icon: Leaf,
      title: "Carbon Neutral Operations",
      description:
        "Zero emissions drone delivery reducing carbon footprint by 95%, with eco-friendly electric rider fleet for backup",
    },
    {
      icon: Smartphone,
      title: "Unified Tracking System",
      description:
        "Real-time tracking for both drone and rider deliveries through single enterprise dashboard with comprehensive analytics",
    },
  ]

  return (
    <section id="features" className="py-12 sm:py-20 px-4 sm:px-6" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-purple-400">Aero Deliver</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Experience the future of industrial delivery with our drone-first approach, backed by intelligent rider
            support for complete coverage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-500/30 transition-colors">
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Delivery Method Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Our Delivery Priority System</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-purple-400">90% Drone Delivery</div>
                  <div className="text-gray-400">Primary Method</div>
                </div>
              </div>
              <div className="text-purple-400 text-2xl">+</div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-500/50 rounded-full flex items-center justify-center">
                  <Bike className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-purple-400">10% Rider Support</div>
                  <div className="text-gray-400">Backup & Specialized</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
