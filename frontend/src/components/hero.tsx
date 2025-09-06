"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Package, MapPin } from "lucide-react"
import { FloatingDrones } from "@/components/floating-drones"
import { DroneAnimation } from "@/components/drone-animation"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center px-4 sm:px-6">
      {/* Floating drones background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingDrones count={6} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Drone-First Industrial
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Delivery Network
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4"
          >
            Advanced autonomous drone network for 90% of industrial deliveries, with intelligent rider backup system
            ensuring 100% delivery success to manufacturing, construction, and mining sites.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 w-full sm:w-auto" asChild>
              <Link href="/signup">
                <Package className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-purple-500 hover:bg-purple-500/20 bg-transparent w-full sm:w-auto"
              asChild
            >
              <Link href="/login">
                <MapPin className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-400 px-4"
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">90%</div>
              <div className="text-sm">Drone Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">50kg</div>
              <div className="text-sm">Max Payload</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">25km</div>
              <div className="text-sm">Industrial Range</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">100%</div>
              <div className="text-sm">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated drone - hidden on mobile for better performance */}
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 hidden sm:block">
        <DroneAnimation />
      </div>
    </div>
  )
}
