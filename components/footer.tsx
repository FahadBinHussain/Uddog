'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { label: 'Browse Campaigns', href: '/campaigns' },
      { label: 'Start a Campaign', href: '/campaigns/create' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Success Stories', href: '/success-stories' },
      { label: 'Pricing', href: '/pricing' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety & Trust', href: '/safety' },
      { label: 'Community Guidelines', href: '/guidelines' },
      { label: 'Report a Campaign', href: '/report' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Investors', href: '/investors' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/uddog', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/uddog', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/uddog', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/uddog', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/uddog', label: 'GitHub' },
  ]

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email') as string

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        form.reset()
        // Show success message (you might want to add a toast here)
        console.log('Successfully subscribed to newsletter')
      } else {
        console.error('Failed to subscribe to newsletter')
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">UdDog</span>
            </Link>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed max-w-md">
              UdDog is the world's most trusted fundraising platform. We help people
              raise money for the causes they care about most.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="rounded-r-none border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Contact</h4>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="mailto:support@uddog.com" className="hover:text-white transition-colors">
                  support@uddog.com
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="tel:+1-555-0123" className="hover:text-white transition-colors">
                  +1 (555) 012-3456
                </a>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  123 Fundraising St<br />
                  San Francisco, CA 94102
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <p>© {currentYear} UdDog, Inc. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for positive impact</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <Link href="/status" className="hover:text-white transition-colors">
              Status
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center items-center space-x-8 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold">SSL</span>
              </div>
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold">PCI</span>
              </div>
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold">SOC</span>
              </div>
              <span>SOC 2 Type II Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
