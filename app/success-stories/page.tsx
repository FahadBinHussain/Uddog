"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Calendar,
  MapPin,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SuccessStoriesPage() {
  const featuredStory = {
    id: 1,
    title: "Rebuilding Hope: Hurricane Relief Fund Success",
    category: "Emergency Relief",
    location: "Florida, USA",
    amountRaised: 125000,
    goal: 100000,
    donors: 2847,
    completedDate: "November 2024",
    image: "/images/hurricane-relief.jpg",
    excerpt: "When Hurricane Ian devastated coastal Florida, the community came together to raise over $125,000, helping 500+ families rebuild their lives.",
    impact: [
      "500+ families received emergency housing assistance",
      "1,200+ meals provided to displaced residents",
      "Emergency supplies distributed to 15 affected communities",
      "3 temporary shelters established and maintained for 2 months"
    ]
  };

  const successStories = [
    {
      id: 2,
      title: "Sarah's Medical Journey: A Community's Love",
      category: "Medical",
      location: "Austin, Texas",
      amountRaised: 45000,
      goal: 35000,
      donors: 892,
      completedDate: "October 2024",
      image: "/images/sarah-medical.jpg",
      excerpt: "A single mother's battle with rare disease became a story of hope as her community rallied to fund life-saving treatment.",
    },
    {
      id: 3,
      title: "Building Dreams: Community Garden Project",
      category: "Community",
      location: "Portland, Oregon",
      amountRaised: 28000,
      goal: 25000,
      donors: 567,
      completedDate: "September 2024",
      image: "/images/community-garden.jpg",
      excerpt: "Transforming an abandoned lot into a thriving community garden that now feeds 200+ local families.",
    },
    {
      id: 4,
      title: "Education for All: Rural School Initiative",
      category: "Education",
      location: "Rural Kenya",
      amountRaised: 67000,
      goal: 60000,
      donors: 1234,
      completedDate: "August 2024",
      image: "/images/school-kenya.jpg",
      excerpt: "Building classrooms and providing resources for 400+ children in rural Kenya to access quality education.",
    },
    {
      id: 5,
      title: "Saving Max: Animal Rescue Success",
      category: "Animals",
      location: "Denver, Colorado",
      amountRaised: 15000,
      goal: 12000,
      donors: 423,
      completedDate: "July 2024",
      image: "/images/animal-rescue.jpg",
      excerpt: "Life-saving surgery for Max the golden retriever led to establishing a fund for emergency pet care.",
    },
    {
      id: 6,
      title: "Veterans Housing Project: Homes for Heroes",
      category: "Veterans",
      location: "San Diego, California",
      amountRaised: 89000,
      goal: 75000,
      donors: 1567,
      completedDate: "June 2024",
      image: "/images/veterans-housing.jpg",
      excerpt: "Providing transitional housing and support services for homeless veterans returning to civilian life.",
    }
  ];

  const categories = [
    { name: "All Stories", count: 847, active: true },
    { name: "Medical", count: 234 },
    { name: "Emergency Relief", count: 156 },
    { name: "Education", count: 189 },
    { name: "Community", count: 123 },
    { name: "Animals", count: 78 },
    { name: "Veterans", count: 67 }
  ];

  const impactStats = [
    {
      icon: Heart,
      value: "$2.5M+",
      label: "Successfully Raised",
      description: "In completed campaigns"
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Lives Impacted",
      description: "Across all success stories"
    },
    {
      icon: Target,
      value: "847",
      label: "Goals Achieved",
      description: "Campaigns that reached their targets"
    },
    {
      icon: CheckCircle,
      value: "98%",
      label: "Success Rate",
      description: "For verified campaigns"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Star className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Success Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Celebrating the incredible impact of our community's generosity and the lives changed through UdDog
          </p>
          <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-6 py-3">
            <Heart className="w-5 h-5 mr-2" />
            Start Your Own Campaign
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Impact Stats */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Collective Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Together, we've created remarkable change across communities worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-green-600" />
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

        {/* Featured Success Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">
              Featured Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Story of the Month
            </h2>
          </div>

          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Featured Story Image</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {featuredStory.category}
                  </Badge>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{featuredStory.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{featuredStory.completedDate}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4">{featuredStory.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{featuredStory.excerpt}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${featuredStory.amountRaised.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {featuredStory.donors.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Donors</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Impact Achieved:</h4>
                  <ul className="space-y-2">
                    {featuredStory.impact.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full">
                  Read Full Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Categories Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={`${category.active ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}`}
              >
                {category.name}
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white text-gray-700"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </section>

        {/* Success Stories Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Heart className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Story Image</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-800">
                      {story.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{story.location}</span>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>{story.completedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold mb-3 line-clamp-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.excerpt}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${story.amountRaised.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {story.donors}
                      </div>
                      <div className="text-xs text-gray-600">Donors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round((story.amountRaised / story.goal) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Goal</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Read Story
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-green-600 hover:bg-green-700">
              Load More Stories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-gradient-to-r from-green-600 to-blue-700 text-white">
            <CardContent className="py-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Success Story?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of changemakers who have turned their vision into reality through the power of community support
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-6 py-3">
                  <Link href="/campaigns/create" className="flex items-center">
                    Start a Campaign
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
