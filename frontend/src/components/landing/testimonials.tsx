"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Star, Quote } from "lucide-react"

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Manufacturing Director",
      content:
        "Aero Deliver has transformed our supply chain operations. Critical components reach our factory floor in minutes, not hours.",
      rating: 5,
      avatar: "/professional-woman-diverse.png",
    },
    {
      name: "Fatima Khan",
      role: "Logistics Manager",
      content:
        "For industrial-grade deliveries, Aero Deliver's precision and reliability is unmatched. Perfect for our heavy machinery parts.",
      rating: 5,
      avatar: "/asian-businessman-meeting.png",
    },
    {
      name: "Muhammad Ali",
      role: "Operations Head",
      content:
        "Emergency industrial supplies delivered with military precision. Aero Deliver keeps our production lines running 24/7.",
      rating: 5,
      avatar: "/female-doctor.png",
    },
  ]

  return (
    <section id="testimonials" className="py-12 sm:py-20 px-4 sm:px-6" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our <span className="text-purple-400">Customers Say</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Aero Deliver
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-purple-400/50 mb-4" />

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">"{testimonial.content}"</p>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
