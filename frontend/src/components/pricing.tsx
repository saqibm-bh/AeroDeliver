"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Check, Zap, Crown, Rocket } from "lucide-react"

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const plans = [
    {
      name: "Basic",
      icon: Zap,
      price: "$5",
      description: "Perfect for occasional deliveries",
      features: [
        "Up to 2kg packages",
        "5km delivery radius",
        "Standard delivery time",
        "Basic tracking",
        "Email notifications",
      ],
      popular: false,
    },
    {
      name: "Pro",
      icon: Crown,
      price: "$12",
      description: "Best for regular users",
      features: [
        "Up to 5kg packages",
        "10km delivery radius",
        "Priority delivery",
        "Real-time tracking",
        "SMS & email notifications",
        "24/7 support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      icon: Rocket,
      price: "$25",
      description: "For businesses and bulk orders",
      features: [
        "Up to 10kg packages",
        "15km delivery radius",
        "Express delivery",
        "Advanced tracking",
        "Multi-channel notifications",
        "Dedicated support",
        "Bulk discounts",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple <span className="text-purple-400">Pricing</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Choose the perfect plan for your delivery needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border transition-all duration-300 ${
                plan.popular
                  ? "border-purple-500 scale-105 bg-purple-500/10"
                  : "border-white/10 hover:border-purple-500/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4">{plan.description}</p>
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {plan.price}
                  <span className="text-lg text-gray-400">/delivery</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300 text-sm sm:text-base">
                    <Check className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
