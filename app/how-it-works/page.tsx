"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Search,
  DollarSign,
  Share2,
  Shield,
  CheckCircle,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "Discover Campaigns",
      description: "Browse through thousands of verified campaigns across various categories like medical, education, community projects, and emergency relief.",
      details: ["Filter by category, location, or cause", "Read detailed campaign stories", "View progress and updates"],
    },
    {
      icon: Heart,
      title: "Choose Your Cause",
      description: "Find campaigns that resonate with you and align with your values. Every campaign is reviewed for authenticity and transparency.",
      details: ["Read verified impact stories", "See how funds are being used", "Connect with campaign creators"],
    },
    {
      icon: DollarSign,
      title: "Make a Donation",
      description: "Support causes with secure, encrypted payments. Choose between one-time donations or recurring monthly contributions.",
      details: ["Secure payment processing", "Tax-deductible receipts", "Flexible donation amounts"],
    },
    {
      icon: Share2,
      title: "Share & Amplify",
      description: "Help campaigns reach their goals by sharing them with your network and following their progress updates.",
      details: ["Social media integration", "Email sharing options", "Campaign progress notifications"],
    },
  ];

  const forCreators = [
    {
      icon: Target,
      title: "Create Your Campaign",
      description: "Tell your story with compelling descriptions, images, and videos to connect with potential donors.",
    },
    {
      icon: Shield,
      title: "Get Verified",
      description: "Our verification process ensures transparency and builds trust with your supporters.",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Engage with donors through updates, comments, and impact stories to build lasting relationships.",
    },
    {
      icon: CheckCircle,
      title: "Achieve Your Goal",
      description: "Receive funds securely and keep supporters updated on how their contributions make a difference.",
    },
  ];

  const features = [
    {
      title: "Zero Platform Fees",
      description: "100% of your donation goes directly to the cause. We're supported by optional donor tips.",
    },
    {
      title: "Verification System",
      description: "Every campaign is reviewed by our trust and safety team to ensure authenticity.",
    },
    {
      title: "Secure Payments",
      description: "Bank-level security with SSL encryption and PCI compliance for all transactions.",
    },
    {
      title: "Global Reach",
      description: "Support causes worldwide with multi-currency support and international payment methods.",
    },
    {
      title: "Mobile Optimized",
      description: "Fully responsive platform that works seamlessly across all devices and browsers.",
    },
    {
      title: "Impact Tracking",
      description: "Follow campaign progress with real-time updates and detailed impact reports.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How UdDog Works
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Connecting generous hearts with meaningful causes through a simple, secure, and transparent platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/campaigns" className="flex items-center">
                Browse Campaigns
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/campaigns/create" className="flex items-center">
                Start a Campaign
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* For Donors Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              For Donors
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Making a Difference is Simple
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these easy steps to support causes you care about and see the real impact of your generosity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* For Campaign Creators Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              For Campaign Creators
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bring Your Vision to Life
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're raising funds for a personal cause, community project, or charitable initiative, we provide the tools you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {forCreators.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose UdDog?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built the most trusted and user-friendly fundraising platform with features designed for both donors and campaign creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of people making a difference every day
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/campaigns" className="flex items-center">
                    Explore Campaigns
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/campaigns/create">
                    Start Fundraising
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
