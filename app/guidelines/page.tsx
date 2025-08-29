'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Users,
  Target,
  CreditCard,
  FileText,
  Heart,
  Scale,
  Eye,
  MessageCircle,
  Flag,
  BookOpen,
  Award
} from 'lucide-react'

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const guidelineCategories = [
  {
    title: "Campaign Creation",
    icon: Target,
    color: "bg-blue-500",
    guidelines: [
      {
        title: "Campaign Requirements",
        items: [
          "Campaigns must have a clear, specific purpose and goal",
          "Funding target should be realistic and well-justified",
          "Campaign description must be detailed (minimum 500 words)",
          "Include a comprehensive budget breakdown",
          "Provide realistic timeline for project completion"
        ]
      },
      {
        title: "Documentation Required",
        items: [
          "Valid identification documents for campaign creators",
          "Business registration (if applicable)",
          "Project plans, blueprints, or detailed proposals",
          "Letters of support from relevant organizations",
          "Permits or approvals required for the project"
        ]
      }
    ]
  },
  {
    title: "Content Standards",
    icon: FileText,
    color: "bg-green-500",
    guidelines: [
      {
        title: "Acceptable Content",
        items: [
          "Educational, creative, and innovative projects",
          "Community development initiatives",
          "Technology and research projects",
          "Arts, culture, and entertainment projects",
          "Environmental and sustainability initiatives"
        ]
      },
      {
        title: "Prohibited Content",
        items: [
          "Illegal activities or products",
          "Discriminatory or hateful content",
          "Adult or explicit content",
          "Gambling or lottery-related campaigns",
          "Personal debt or bills payment",
          "Investment opportunities or financial schemes"
        ]
      }
    ]
  },
  {
    title: "Financial Guidelines",
    icon: CreditCard,
    color: "bg-purple-500",
    guidelines: [
      {
        title: "Funding Rules",
        items: [
          "Funds must be used only for the stated campaign purpose",
          "Campaign creators must provide regular progress updates",
          "Unused funds may need to be returned to backers",
          "Platform fee is 5% of successfully funded campaigns",
          "Payment processing fees apply (2.9% + $0.30 per transaction)"
        ]
      },
      {
        title: "Refund Policy",
        items: [
          "Backers can request refunds before campaign deadline",
          "Failed campaigns are automatically refunded",
          "Partial refunds may be available for unfulfilled rewards",
          "Disputes are handled through our resolution process",
          "Processing time for refunds is 5-10 business days"
        ]
      }
    ]
  },
  {
    title: "Community Standards",
    icon: Users,
    color: "bg-orange-500",
    guidelines: [
      {
        title: "Communication",
        items: [
          "Maintain respectful and professional communication",
          "Respond to backer inquiries within 48 hours",
          "Provide regular campaign updates (at least weekly)",
          "Be transparent about challenges or delays",
          "Use appropriate language in all communications"
        ]
      },
      {
        title: "Rewards & Fulfillment",
        items: [
          "Clearly describe all rewards and delivery timelines",
          "Rewards must be realistic and achievable",
          "Shipping costs must be clearly stated",
          "International shipping restrictions must be noted",
          "Provide tracking information for physical rewards"
        ]
      }
    ]
  }
]

const complianceItems = [
  {
    title: "Legal Compliance",
    description: "All campaigns must comply with local, national, and international laws",
    icon: Scale
  },
  {
    title: "Tax Responsibilities",
    description: "Campaign creators are responsible for all applicable taxes",
    icon: FileText
  },
  {
    title: "Intellectual Property",
    description: "Respect copyrights, trademarks, and other intellectual property rights",
    icon: Shield
  },
  {
    title: "Privacy Protection",
    description: "Protect backer privacy and handle personal data responsibly",
    icon: Eye
  }
]

const reportingReasons = [
  "Fraudulent or misleading campaign",
  "Inappropriate content",
  "Spam or harassment",
  "Intellectual property violation",
  "Terms of service violation",
  "Other policy violation"
]

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Platform Guidelines
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive guidelines ensure a safe, transparent, and successful fundraising experience for everyone in our community.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-8 w-8" />
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Shield className="h-8 w-8" />
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-muted-foreground">Protection</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
                  <Users className="h-8 w-8" />
                  <div>
                    <div className="text-2xl font-bold">1M+</div>
                    <div className="text-sm text-muted-foreground">Community</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 text-orange-600 dark:text-orange-400">
                  <Award className="h-8 w-8" />
                  <div>
                    <div className="text-2xl font-bold">5%</div>
                    <div className="text-sm text-muted-foreground">Platform Fee</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Guidelines */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {guidelineCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>
                        Essential guidelines for {category.title.toLowerCase()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.guidelines.map((guideline, guidelineIndex) => (
                      <AccordionItem key={guidelineIndex} value={`item-${index}-${guidelineIndex}`}>
                        <AccordionTrigger className="text-left">
                          {guideline.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {guideline.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Compliance Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="h-6 w-6 text-blue-600" />
                  <span>Legal Compliance & Responsibilities</span>
                </CardTitle>
                <CardDescription>
                  Important legal considerations for all platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                      <item.icon className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reporting Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="h-6 w-6 text-red-600" />
                  <span>Reporting & Enforcement</span>
                </CardTitle>
                <CardDescription>
                  How to report violations and our enforcement process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Report a Campaign or User</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you encounter content or behavior that violates our guidelines, please report it using one of these reasons:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {reportingReasons.map((reason, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded bg-muted/30">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Enforcement Actions</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>
                      <span className="text-sm text-muted-foreground">First-time minor violations receive a warning with guidance</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="text-orange-600 border-orange-600">Suspension</Badge>
                      <span className="text-sm text-muted-foreground">Temporary account restrictions for repeated violations</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="text-red-600 border-red-600">Removal</Badge>
                      <span className="text-sm text-muted-foreground">Campaign removal for serious policy violations</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="text-red-800 border-red-800">Ban</Badge>
                      <span className="text-sm text-muted-foreground">Permanent platform ban for severe or repeated violations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <span>Need Help?</span>
                </CardTitle>
                <CardDescription>
                  Get in touch with our support team for questions about these guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Community Support</h4>
                    <p className="text-sm text-muted-foreground">Join our community forum for peer support</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Live Chat</h4>
                    <p className="text-sm text-muted-foreground">Available 24/7 for urgent issues</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Help Center</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive guides and tutorials</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
