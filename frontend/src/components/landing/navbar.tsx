"use client"

import { Button } from "@/components/ui/button"
import { Plane, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import type React from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-sm border-b border-white/10 relative z-50"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Plane className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
        <span className="text-white font-medium text-lg sm:text-xl">Aero Deliver</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="#features">Capabilities</NavLink>
        <NavLink href="#how-it-works">Operations</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#testimonials">Case Studies</NavLink>
        <NavLink href="#contact">Contact</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:text-purple-500" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col space-y-4 px-6 py-6">
              <MobileNavLink href="#features" onClick={() => setIsOpen(false)}>
                Capabilities
              </MobileNavLink>
              <MobileNavLink href="#how-it-works" onClick={() => setIsOpen(false)}>
                Operations
              </MobileNavLink>
              <MobileNavLink href="#testimonials" onClick={() => setIsOpen(false)}>
                Case Studies
              </MobileNavLink>
              <MobileNavLink href="#contact" onClick={() => setIsOpen(false)}>
                Contact
              </MobileNavLink>
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Button variant="ghost" className="text-white hover:text-purple-500 justify-start" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-gray-300 hover:text-white transition-colors text-lg">
      {children}
    </Link>
  )
}
