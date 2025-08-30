"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function SafetyPage() {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Campaign Verification",
      description: "Every campaign undergoes thorough review by our trust and safety team before going live.",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Bank-level encryption and PCI compliance ensure your financial information is always protected.",
    },
    {
      icon: Eye,
      title: "Transparency Reports",
      description: "Campaign creators must provide regular updates and detailed reports on fund usage.",
    },
    {
      icon: Users,
      title: "Community Monitoring",
      description: "Our community actively reports suspicious campaigns and helps maintain platform integrity.",
    },
  ];

  const reportingSteps = [
    {
      step: "1",
      title: "Identify the Issue",
      description: "Notice something suspicious or inappropriate about a campaign.",
    },
    {
      step: "2",
      title: "Report the Campaign",
      description: "Use the report button on the campaign page to flag it for review.",
    },
    {
      step: "3",
      title: "Provide Details",
      description: "Give specific information about the concern to help our team investigate.",
    },
    {
      step: "4",
      title: "Investigation",
      description: "Our trust team reviews the report within 24-48 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Safety & Trust
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Your security is our top priority. Learn how we protect donors and ensure campaign authenticity.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Safety Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              Security Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We Keep You Safe
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've implemented multiple layers of security and verification to protect both donors and campaign creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reporting Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-800 border-red-200">
              Report Concerns
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How to Report Suspicious Activity
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help us maintain a safe platform by reporting campaigns that seem fraudulent or inappropriate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reportingSteps.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow duration-300">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Guidelines */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Safe Donation Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Only donate to verified campaigns with the verification badge</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Read campaign updates and progress reports regularly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use secure payment methods through our platform only</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Report any suspicious or concerning activity immediately</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep records of your donations for tax purposes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Red Flags to Watch For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Campaigns with vague or inconsistent stories</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Requests for payment outside our platform</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Excessive urgency or pressure tactics</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No campaign updates or progress reports</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Stock photos or stolen images</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <Card className="bg-gradient-to-r from-blue-600 to-green-700 text-white">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Need Help or Have Concerns?</h2>
              <p className="text-xl mb-8 opacity-90">
                Our trust and safety team is here to help 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <a href="mailto:safety@uddog.com" className="hover:underline">
                    safety@uddog.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <a href="tel:+1-555-0123" className="hover:underline">
                    +1 (555) 012-3456
                  </a>
                </div>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/report" className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Report a Campaign
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
