"use client"

import { motion } from "framer-motion"
import { Plane } from "lucide-react"

export function DroneAnimation() {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          {/* Drone glow effect */}
          <motion.div
            className="absolute -inset-6 bg-purple-500/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Propeller blur effect */}
          <motion.div
            className="absolute -top-4 -left-4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-400/30 rounded-full blur-sm"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 0.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-400/30 rounded-full blur-sm"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 0.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-400/30 rounded-full blur-sm"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 0.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-400/30 rounded-full blur-sm"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 0.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Main drone body */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Plane className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
