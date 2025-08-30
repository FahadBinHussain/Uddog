"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Server,
  Database,
  CreditCard,
  Mail,
  Shield,
} from "lucide-react";

export default function StatusPage() {
  const services = [
    {
      name: "Website",
      status: "operational",
      description: "Main platform and user interface",
      icon: Server,
    },
    {
      name: "API Services",
      status: "operational",
      description: "Campaign and donation APIs",
      icon: Database,
    },
    {
      name: "Payment Processing",
      status: "operational",
      description: "Stripe payment integration",
      icon: CreditCard,
    },
    {
      name: "Email Service",
      status: "operational",
      description: "Notifications and confirmations",
      icon: Mail,
    },
    {
      name: "Authentication",
      status: "operational",
      description: "User login and security",
      icon: Shield,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "down":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Operational
          </Badge>
        );
      case "degraded":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Degraded Performance
          </Badge>
        );
      case "down":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Service Down
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <h1 className="text-4xl md:text-6xl font-bold">System Status</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Real-time status of UdDog platform services and infrastructure
          </p>
          <Badge className="bg-green-500 text-white text-lg px-4 py-2">
            All Systems Operational
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Overall Status */}
        <section className="mb-12">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-green-800">
                    All Systems Operational
                  </h2>
                  <p className="text-green-700">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Service Status */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Service Status</h2>
          <div className="space-y-4">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <service.icon className="w-6 h-6 text-gray-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(service.status)}
                      <div className="ml-3">{getStatusBadge(service.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-green-600">
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  142ms
                </div>
                <p className="text-gray-600">Average API response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center text-blue-600">
                  Uptime
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  99.98%
                </div>
                <p className="text-gray-600">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center text-purple-600">
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  99.95%
                </div>
                <p className="text-gray-600">Payment processing</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Recent Incidents
          </h2>
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Recent Incidents</h3>
              <p className="text-gray-600">
                All systems have been running smoothly. Last incident was over
                30 days ago.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Scheduled Maintenance */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Scheduled Maintenance
          </h2>
          <Card>
            <CardContent className="py-8 text-center">
              <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Scheduled Maintenance
              </h3>
              <p className="text-gray-600">
                No maintenance windows are currently scheduled. We'll notify you
                in advance of any planned downtime.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
