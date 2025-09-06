"use client"

import type React from "react"

import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Plane className="w-8 h-8 text-purple-500" />
              <span className="text-white font-medium text-xl">Aero Deliver</span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Industrial-grade drone delivery solutions for manufacturing, construction, and heavy industry operations.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={Facebook} />
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Instagram} />
              <SocialLink href="#" icon={Linkedin} />
            </div>
          </div>

          {/* Industrial Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Industrial Services</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Heavy Payload Delivery</FooterLink>
              <FooterLink href="#">Construction Site Supply</FooterLink>
              <FooterLink href="#">Manufacturing Parts</FooterLink>
              <FooterLink href="#">Mining Operations</FooterLink>
              <FooterLink href="#">Enterprise Solutions</FooterLink>
            </ul>
          </div>

          {/* Enterprise Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Enterprise Support</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Operations Center</FooterLink>
              <FooterLink href="#">Fleet Management</FooterLink>
              <FooterLink href="#">Site Coverage</FooterLink>
              <FooterLink href="#">Safety Protocols</FooterLink>
              <FooterLink href="#">Service Agreements</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 text-sm sm:text-base">
                <Mail className="w-4 h-4 mr-3 text-purple-400" />
                support@aerodeliver.com
              </div>
              <div className="flex items-center text-gray-400 text-sm sm:text-base">
                <Phone className="w-4 h-4 mr-3 text-purple-400" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center text-gray-400 text-sm sm:text-base">
                <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                San Francisco, CA
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">© 2024 Aero Deliver. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors">
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ href, icon: Icon }: { href: string; icon: React.ComponentType<any> }) {
  return (
    <Link
      href={href}
      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all"
    >
      <Icon className="w-5 h-5" />
    </Link>
  )
}
