"use client"

import { useEffect, useRef, useState } from "react"
import { useMousePosition } from "@/lib/hooks/use-mouse-position"

interface ParticlesProps {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  className?: string
  particleColor?: string
}

export const SkyParticles = ({
  id = "particles",
  background = "transparent",
  minSize = 0.8,
  maxSize = 2.0,
  particleDensity = 80,
  className = "h-full w-full",
  particleColor = "#A855F7",
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const animationFrameRef = useRef<number>()
  // Use a typed Particle instance array
  const particlesRef = useRef<InstanceType<typeof Particle>[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * (maxSize - minSize) + minSize
        this.speedX = Math.random() * 0.8 - 0.4
        this.speedY = Math.random() * 0.8 - 0.4
        this.opacity = Math.random() * 0.8 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height

        // Mouse interaction - particles drift away from cursor like wind
        const dx = mousePosition.x - this.x
        const dy = mousePosition.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150) {
          const angle = Math.atan2(dy, dx)
          this.x -= Math.cos(angle) * 0.5
          this.y -= Math.sin(angle) * 0.5
        }

        // Gentle opacity pulsing
        this.opacity = 0.3 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.3
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const init = () => {
      particlesRef.current = []
      for (let i = 0; i < particleDensity; i++) {
        particlesRef.current.push(new Particle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    dimensions.width,
    dimensions.height,
    maxSize,
    minSize,
    particleColor,
    particleDensity,
    mousePosition.x,
    mousePosition.y,
  ])

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        background,
        width: dimensions.width,
        height: dimensions.height,
      }}
    />
  )
}
