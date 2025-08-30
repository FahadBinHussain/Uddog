"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Download,
  Mail,
  Phone,
  Award,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default function PressPage() {
  const pressReleases = [
    {
      title: "UdDog Raises $10M Series A to Expand Global Fundraising Platform",
      date: "December 15, 2024",
      excerpt: "Leading fundraising platform UdDog announces Series A funding to enhance security features and expand internationally.",
      category: "Funding",
    },
    {
      title: "UdDog Surpasses $100M in Total Donations Raised",
      date: "November 28, 2024",
      excerpt: "Platform milestone reached as community-driven campaigns continue to make global impact across various causes.",
      category: "Milestone",
    },
    {
      title: "New Verification System Launches to Combat Fraudulent Campaigns",
      date: "October 10, 2024",
      excerpt: "Enhanced AI-powered verification process reduces fraud by 95% while maintaining user-friendly campaign creation.",
      category: "Product",
    },
    {
      title: "UdDog Partners with Global NGOs for Disaster Relief Initiatives",
      date: "September 22, 2024",
      excerpt: "Strategic partnerships enable rapid response fundraising for international disaster relief and humanitarian aid.",
      category: "Partnership",
    },
  ];

  const mediaKit = [
    {
      title: "Company Logo Package",
      description: "High-resolution logos in various formats",
      type: "ZIP",
      size: "2.4 MB",
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand style guide and usage guidelines",
      type: "PDF",
      size: "1.8 MB",
    },
    {
      title: "Product Screenshots",
      description: "High-quality screenshots of platform features",
      type: "ZIP",
      size: "5.2 MB",
    },
    {
      title: "Executive Photos",
      description: "Professional headshots of leadership team",
      type: "ZIP",
      size: "3.1 MB",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "2.5M+",
      label: "Active Users",
      description: "Donors and campaign creators worldwide",
    },
    {
      icon: TrendingUp,
      value: "$150M+",
      label: "Funds Raised",
      description: "Total amount raised for causes",
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries",
      description: "Global reach across continents",
    },
    {
      icon: Award,
      value: "98%",
      label: "Trust Score",
      description: "User satisfaction and trust rating",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <FileText className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Press Center
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Latest news, updates, and resources for media professionals covering UdDog
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-6 py-3">
            <Mail className="w-5 h-5 mr-2" />
            Contact Press Team
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Company Stats */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              UdDog at a Glance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key statistics and achievements that define our platform's impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest Press Releases
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest announcements and company news
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">{release.date}</span>
                      <Badge className="ml-4 bg-blue-100 text-blue-800 border-blue-200">
                        {release.category}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Read Full Release
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{release.title}</h3>
                  <p className="text-gray-600">{release.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              View All Press Releases
            </Button>
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Media Kit & Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Download high-quality assets and resources for your coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaKit.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">
                          {item.type}
                        </span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                    <Button className="ml-4">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Company Information */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                About UdDog
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Company Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Founded in 2020, UdDog has emerged as the world's most trusted fundraising platform,
                    connecting generous hearts with meaningful causes. Our mission is to democratize
                    fundraising and make it accessible for anyone to support the causes they care about most.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    With advanced security features, transparent verification processes, and a global
                    community of over 2.5 million users, UdDog has facilitated over $150 million in
                    donations across 50+ countries.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Zero platform fees - 100% of donations reach causes</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">AI-powered fraud detection and verification</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Real-time impact tracking and reporting</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Multi-currency and international payment support</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Mobile-optimized platform for all devices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section>
          <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <CardContent className="py-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Press Inquiries</h2>
                <p className="text-xl opacity-90">
                  Get in touch with our media relations team
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href="mailto:press@uddog.com" className="hover:underline">
                    press@uddog.com
                  </a>
                </div>

                <div className="text-center">
                  <Phone className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href="tel:+1-555-0199" className="hover:underline">
                    +1 (555) 019-9876
                  </a>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm opacity-80">
                  Response time: Within 24 hours for press inquiries
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
