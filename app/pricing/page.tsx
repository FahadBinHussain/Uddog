"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  DollarSign,
  Heart,
  Shield,
  Users,
  Zap,
  Star,
  ArrowRight,
  Gift,
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for individuals and small campaigns",
      features: [
        "Create unlimited campaigns",
        "Basic campaign customization",
        "Standard payment processing",
        "Email notifications",
        "Basic analytics",
        "Community support",
      ],
      limitations: [
        "UdDog branding on campaigns",
        "Standard verification process",
        "Basic reporting",
      ],
      cta: "Get Started Free",
      popular: false,
      color: "blue",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Enhanced features for serious fundraisers",
      features: [
        "Everything in Basic",
        "Custom campaign branding",
        "Priority verification",
        "Advanced analytics & insights",
        "Recurring donation management",
        "Priority customer support",
        "Social media integration",
        "Custom thank you messages",
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true,
      color: "green",
    },
    {
      name: "Organization",
      price: "$99",
      period: "/month",
      description: "Built for nonprofits and large organizations",
      features: [
        "Everything in Pro",
        "Multi-user team management",
        "White-label campaigns",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced fraud protection",
        "Compliance reporting",
        "Bulk donor management",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      color: "purple",
    },
  ];

  const additionalFeatures = [
    {
      icon: DollarSign,
      title: "Zero Platform Fees",
      description: "100% of donations go directly to your cause. We're supported by optional donor tips.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data and donations are protected with enterprise-grade security and encryption.",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Access your funds immediately with instant payout options to your bank account.",
    },
    {
      icon: Users,
      title: "Global Reach",
      description: "Accept donations from anywhere in the world with multi-currency support.",
    },
  ];

  const faqs = [
    {
      question: "Are there really no platform fees?",
      answer: "That's right! UdDog doesn't charge any platform fees. 100% of donations go directly to your campaign. We're sustained by optional tips from donors."
    },
    {
      question: "How do payment processing fees work?",
      answer: "Payment processing fees (2.9% + $0.30 per transaction) are charged by our payment processors (Stripe/PayPal) and are industry standard. These fees are automatically deducted from donations."
    },
    {
      question: "Can I switch plans anytime?",
      answer: "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and you'll only be charged for what you use."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you when you're approaching your limits. You can either upgrade your plan or we'll help you optimize your current usage."
    },
    {
      question: "Do you offer discounts for nonprofits?",
      answer: "Yes! Verified 501(c)(3) organizations receive a 50% discount on Pro and Organization plans. Contact us for nonprofit pricing."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Choose the plan that fits your fundraising needs. Always with zero platform fees.
          </p>
          <Badge className="bg-green-500 text-white text-lg px-4 py-2">
            <Gift className="w-4 h-4 mr-2" />
            100% of donations reach your cause
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular
                    ? "border-green-500 border-2 shadow-lg scale-105"
                    : "hover:scale-102"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="py-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start">
                        <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-green-600 hover:bg-green-700"
                        : plan.color === "purple"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Makes UdDog Different
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Features that come standard with every plan, because every cause deserves the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                For large enterprises, government organizations, or unique requirements,
                we offer custom solutions tailored to your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Contact Enterprise Sales
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Schedule a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Got questions about our pricing? We've got answers.
            </p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-green-600 to-blue-700 text-white">
            <CardContent className="py-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to Start Fundraising?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join millions of people who trust UdDog to help them raise money for the causes they care about
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-6 py-3">
                  <Link href="/campaigns/create" className="flex items-center">
                    Start Your Campaign
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-6 py-3">
                  <Link href="/campaigns">
                    Browse Campaigns
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
