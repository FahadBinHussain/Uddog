"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cookie,
  Settings,
  Eye,
  Shield,
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function CookiesPage() {
  const cookieTypes = [
    {
      title: "Essential Cookies",
      description: "Required for the website to function properly",
      icon: Shield,
      required: true,
      examples: [
        "Authentication tokens",
        "Session management",
        "Security preferences",
        "Load balancing"
      ]
    },
    {
      title: "Performance Cookies",
      description: "Help us understand how visitors interact with our website",
      icon: BarChart3,
      required: false,
      examples: [
        "Page load times",
        "Error tracking",
        "Feature usage analytics",
        "Performance monitoring"
      ]
    },
    {
      title: "Functional Cookies",
      description: "Enable enhanced functionality and personalization",
      icon: Settings,
      required: false,
      examples: [
        "Language preferences",
        "Theme settings",
        "Form auto-fill",
        "Accessibility options"
      ]
    },
    {
      title: "Marketing Cookies",
      description: "Used to track visitors for advertising purposes",
      icon: Users,
      required: false,
      examples: [
        "Ad targeting",
        "Campaign tracking",
        "Social media integration",
        "Retargeting pixels"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Cookie className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Learn about how we use cookies to improve your experience on UdDog
          </p>
          <Badge className="bg-white text-orange-600 text-lg px-4 py-2">
            Last updated: December 2024
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* What Are Cookies */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                They help websites remember information about your visit, which can make it easier to visit the site again
                and make the site more useful to you.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mt-4">
                At UdDog, we use cookies to enhance your browsing experience, analyze site usage, and support our
                fundraising platform's functionality. This policy explains what cookies we use and why.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Types of Cookies */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We categorize cookies based on their purpose and functionality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <type.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                    </div>
                    {type.required ? (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Optional
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Examples:</h4>
                    <ul className="space-y-1">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cookie Management */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Browser Settings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">View which cookies are stored</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Delete existing cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Block cookies from specific sites</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Block all cookies</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Our Cookie Banner
                  </h3>
                  <p className="text-gray-600 mb-4">
                    When you first visit UdDog, you'll see a cookie banner that allows you to:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Accept all cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Accept only essential cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Customize your preferences</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Change settings anytime</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Cookie Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Some features on our website use third-party services that may set their own cookies:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-600">Website usage analytics</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Stripe</h4>
                  <p className="text-sm text-gray-600">Payment processing security</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Social Media</h4>
                  <p className="text-sm text-gray-600">Social sharing features</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section>
          <Card className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Questions About Cookies?</h2>
              <p className="text-xl mb-8 opacity-90">
                Contact us if you have any questions about our cookie policy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  View Privacy Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
