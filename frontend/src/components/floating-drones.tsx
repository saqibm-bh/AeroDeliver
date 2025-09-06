"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Plane } from "lucide-react"

export function FloatingDrones({ count = 6 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reduce count on mobile for better performance
  const mobileCount = Math.max(3, Math.floor(count / 2))
  const actualCount = dimensions.width < 768 ? mobileCount : count

  // Precompute random seeds on client after mount to avoid SSR/CSR mismatch
  const seeds = useMemo(() => {
    if (!mounted) return [] as { x: number; y: number; duration: number }[]
    return Array.from({ length: actualCount }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      duration: 25 + Math.random() * 15,
    }))
  }, [mounted, actualCount])

  return (
    <div className="relative w-full h-full">
      {mounted && seeds.map((seed, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: seed.x * dimensions.width,
            y: seed.y * dimensions.height,
          }}
          animate={{
            x: [
              seed.x * dimensions.width,
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
            ],
            y: [
              seed.y * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            rotate: [0, 360],
          }}
          transition={{
            duration: seed.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="relative group">
            {/* Drone glow */}
            <div className="absolute -inset-2 bg-purple-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Propeller effects - simplified on mobile */}
            {dimensions.width >= 768 && (
              <>
                <motion.div
                  className="absolute -top-1 -left-1 w-2 h-2 bg-purple-300/40 rounded-full blur-sm"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.05, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-purple-300/40 rounded-full blur-sm"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.05, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300/40 rounded-full blur-sm"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.05, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-300/40 rounded-full blur-sm"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.05, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </>
            )}

            {/* Main drone */}
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-400/30 flex items-center justify-center transform hover:scale-110 transition-transform">
              <Plane className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400/70" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
