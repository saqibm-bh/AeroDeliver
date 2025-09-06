"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Package, MapPin, Plane, CheckCircle, Bike, Brain } from "lucide-react"

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const steps = [
    {
      icon: Package,
      title: "Industrial Request",
      description:
        "Submit delivery request through our enterprise portal with specifications, weight, and site coordinates",
      step: "01",
    },
    {
      icon: Brain,
      title: "Smart Route Analysis",
      description:
        "AI system analyzes delivery requirements, weather, airspace restrictions to select optimal method (drone priority)",
      step: "02",
    },
    {
      icon: Plane,
      title: "Drone Dispatch (Primary)",
      description:
        "90% of deliveries: Industrial-grade drones with 50kg payload capacity deployed from nearest distribution center",
      step: "03",
    },
    {
      icon: Bike,
      title: "Rider Backup (When Needed)",
      description:
        "10% of deliveries: Professional riders dispatched for restricted airspace, weather conditions, or specialized handling",
      step: "04",
    },
    {
      icon: MapPin,
      title: "Precision Delivery",
      description: "GPS-guided delivery to exact coordinates - drone landing or rider handoff based on selected method",
      step: "05",
    },
    {
      icon: CheckCircle,
      title: "Unified Confirmation",
      description:
        "Real-time delivery confirmation with digital signatures and instant notification to operations team",
      step: "06",
    },
  ]

  return (
    <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It <span className="text-purple-400">Works</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Intelligent delivery system with drone-first approach and smart rider backup for 100% delivery success rate
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Step connector line */}
              {index < steps.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent transform translate-x-4" />
              )}

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-500/30 transition-colors">
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delivery Method Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Smart Delivery Decision Flow</h3>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Drone Path */}
              <div className="flex-1 text-center">
                <div className="bg-purple-600 rounded-lg p-6 mb-4">
                  <Plane className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-white font-bold">Drone Delivery</div>
                  <div className="text-purple-200 text-sm">90% of Orders</div>
                </div>
                <div className="text-gray-400 text-sm">
                  ✓ Clear airspace
                  <br />✓ Good weather
                  <br />✓ Standard packages
                  <br />✓ Accessible landing zones
                </div>
              </div>

              <div className="text-purple-400 text-2xl font-bold">OR</div>

              {/* Rider Path */}
              <div className="flex-1 text-center">
                <div className="bg-purple-500/70 rounded-lg p-6 mb-4">
                  <Bike className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-white font-bold">Rider Delivery</div>
                  <div className="text-purple-200 text-sm">10% of Orders</div>
                </div>
                <div className="text-gray-400 text-sm">
                  ✓ Restricted airspace
                  <br />✓ Adverse weather
                  <br />✓ Fragile/Special handling
                  <br />✓ Complex locations
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
