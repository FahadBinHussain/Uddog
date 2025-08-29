'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Shield,
  CreditCard,
  Users,
  Target,
  Settings,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Star,
  CheckCircle
} from 'lucide-react'

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    faqs: [
      {
        question: 'How do I create my first campaign?',
        answer: 'To create your first campaign, sign up for an account, click "Start a Campaign" from the dashboard, fill out the campaign details including title, description, goal amount, and upload photos. Our step-by-step guide will walk you through the entire process.'
      },
      {
        question: 'Is it free to create a campaign?',
        answer: 'Yes, creating a campaign on UdDog is completely free. We only charge a small platform fee (2.9% + $0.30) when you receive donations to cover payment processing and platform maintenance costs.'
      },
      {
        question: 'How long does it take for my campaign to go live?',
        answer: 'Most campaigns are reviewed and approved within 24-48 hours. Our trust and safety team reviews each campaign to ensure it meets our community guidelines before it goes live.'
      },
      {
        question: 'What types of campaigns are allowed?',
        answer: 'We support various types of campaigns including medical emergencies, education expenses, community projects, disaster relief, animal welfare, and creative projects. View our guidelines page for the full list of supported causes.'
      }
    ]
  },
  {
    id: 'donations',
    title: 'Donations & Payments',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely through our trusted payment partners.'
      },
      {
        question: 'How quickly do funds reach campaign creators?',
        answer: 'Funds are typically transferred to campaign creators within 2-5 business days after a donation is made. This allows time for payment processing and fraud prevention checks.'
      },
      {
        question: 'Can I get a refund on my donation?',
        answer: 'Refunds are handled on a case-by-case basis. If you have concerns about a campaign or need to request a refund, please contact our support team within 30 days of your donation.'
      },
      {
        question: 'Are donations tax-deductible?',
        answer: 'Donations to personal campaigns are generally not tax-deductible. However, donations to verified nonprofits through our platform may be tax-deductible. Consult with a tax professional for specific advice.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Security',
    icon: Shield,
    faqs: [
      {
        question: 'How do I verify my campaign?',
        answer: 'Campaign verification involves submitting supporting documentation such as medical bills, school enrollment letters, or legal documents. Our verification team will review your submission and update your campaign status within 3-5 business days.'
      },
      {
        question: 'I forgot my password. How can I reset it?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
      },
      {
        question: 'How do I update my account information?',
        answer: 'Go to your account settings by clicking on your profile icon, then select "Settings." You can update your personal information, contact details, and notification preferences from there.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information. We never sell or share your data with third parties without your consent.'
      }
    ]
  },
  {
    id: 'campaign-management',
    title: 'Campaign Management',
    icon: Target,
    faqs: [
      {
        question: 'How do I promote my campaign?',
        answer: 'Use our built-in sharing tools to post on social media, send email updates to supporters, and engage with your community. Regular updates with photos and progress reports help keep donors engaged.'
      },
      {
        question: 'Can I edit my campaign after it\'s published?',
        answer: 'Yes, you can edit your campaign description, add updates, and upload new photos at any time. However, you cannot change the campaign title or goal amount once donations have been received.'
      },
      {
        question: 'What happens if I don\'t reach my goal?',
        answer: 'You keep all the funds raised, regardless of whether you reach your goal. There\'s no penalty for not reaching your target amount, and you can continue fundraising or extend your campaign if needed.'
      },
      {
        question: 'How do I withdraw funds from my campaign?',
        answer: 'Go to your campaign dashboard and click "Withdraw Funds." You\'ll need to provide bank account information for direct deposit. Funds are typically transferred within 2-5 business days.'
      }
    ]
  }
]

const quickLinks = [
  {
    title: 'Campaign Guidelines',
    description: 'Learn what types of campaigns are allowed',
    href: '/guidelines',
    icon: BookOpen
  },
  {
    title: 'Trust & Safety',
    description: 'Our commitment to keeping the platform safe',
    href: '/trust-safety',
    icon: Shield
  },
  {
    title: 'Fee Structure',
    description: 'Understand our transparent pricing',
    href: '/pricing',
    icon: CreditCard
  },
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    href: '/contact',
    icon: MessageCircle
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('getting-started')

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              How Can We Help?
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Find answers to common questions, browse our guides, or get in touch with our support team.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for help articles, guides, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-full border-0 shadow-lg bg-white/95 backdrop-blur-sm focus:bg-white transition-colors"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Help Topics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Quick access to the most requested information
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {quickLinks.map((link, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <link.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                          {link.title}
                          <ChevronRight className="w-4 h-4 ml-1 text-gray-400" />
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find answers to the most common questions about UdDog
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-8">
                {faqCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs lg:text-sm">
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {faqCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Accordion type="single" collapsible className="space-y-4">
                      {(searchQuery ? filteredFaqs.find(c => c.id === category.id)?.faqs : category.faqs)?.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <Card className="bg-white dark:bg-gray-900">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                              <div className="flex items-start space-x-3 text-left">
                                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {faq.question}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="ml-8 text-gray-600 dark:text-gray-300">
                                {faq.answer}
                              </div>
                            </AccordionContent>
                          </Card>
                        </AccordionItem>
                      )) || (
                        <div className="text-center py-8">
                          <p className="text-gray-600 dark:text-gray-300">
                            No FAQs found matching your search.
                          </p>
                        </div>
                      )}
                    </Accordion>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our support team is here to help you with any questions
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 text-center h-full">
                <CardContent className="p-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Email Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Get detailed help via email
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    support@uddog.com
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 text-center h-full">
                <CardContent className="p-6">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Chat with us in real-time
                  </p>
                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 text-center h-full">
                <CardContent className="p-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                    <Phone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Speak with our team directly
                  </p>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    +1 (555) 123-4567
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
