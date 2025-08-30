"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Heart,
  Users,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "The Psychology of Giving: Why People Donate and How to Inspire More Generosity",
    excerpt: "Understanding the emotional and psychological drivers behind charitable giving can help campaign creators build more effective fundraising strategies.",
    author: "Sarah Johnson",
    authorRole: "Fundraising Expert",
    date: "December 20, 2024",
    readTime: "8 min read",
    category: "Fundraising Tips",
    image: "/blog/psychology-of-giving.jpg",
    featured: true,
  };

  const blogPosts = [
    {
      id: 2,
      title: "10 Proven Strategies to Boost Your Campaign's Visibility",
      excerpt: "From social media tactics to email marketing, discover the most effective ways to get your campaign noticed.",
      author: "Mike Chen",
      authorRole: "Marketing Specialist",
      date: "December 18, 2024",
      readTime: "6 min read",
      category: "Marketing",
      image: "/blog/campaign-visibility.jpg",
    },
    {
      id: 3,
      title: "Building Trust: How Transparency Increases Donation Success",
      excerpt: "Learn why transparency is crucial for fundraising success and practical ways to build trust with potential donors.",
      author: "Emma Rodriguez",
      authorRole: "Trust & Safety Expert",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Best Practices",
      image: "/blog/building-trust.jpg",
    },
    {
      id: 4,
      title: "The Ultimate Guide to Writing Compelling Campaign Stories",
      excerpt: "Master the art of storytelling to create emotional connections that drive donations and support.",
      author: "David Kim",
      authorRole: "Content Strategist",
      date: "December 12, 2024",
      readTime: "10 min read",
      category: "Storytelling",
      image: "/blog/compelling-stories.jpg",
    },
    {
      id: 5,
      title: "Recurring Donations: Building Sustainable Support for Your Cause",
      excerpt: "Why monthly donors are more valuable than one-time contributors and how to convert supporters into recurring donors.",
      author: "Lisa Park",
      authorRole: "Donor Relations Manager",
      date: "December 10, 2024",
      readTime: "7 min read",
      category: "Donor Relations",
      image: "/blog/recurring-donations.jpg",
    },
    {
      id: 6,
      title: "Crisis Fundraising: Responding to Emergencies with Speed and Compassion",
      excerpt: "Best practices for launching emergency campaigns and mobilizing support during times of crisis.",
      author: "Carlos Martinez",
      authorRole: "Emergency Response Coordinator",
      date: "December 8, 2024",
      readTime: "9 min read",
      category: "Emergency Response",
      image: "/blog/crisis-fundraising.jpg",
    },
    {
      id: 7,
      title: "Social Media Fundraising: Leveraging Platforms for Maximum Impact",
      excerpt: "Platform-specific strategies for Facebook, Instagram, Twitter, and TikTok to amplify your campaign reach.",
      author: "Jessica Wong",
      authorRole: "Social Media Manager",
      date: "December 5, 2024",
      readTime: "8 min read",
      category: "Social Media",
      image: "/blog/social-media-fundraising.jpg",
    },
    {
      id: 8,
      title: "Legal Considerations for Fundraising: What You Need to Know",
      excerpt: "Navigate the legal landscape of online fundraising with confidence and ensure compliance.",
      author: "Robert Thompson",
      authorRole: "Legal Advisor",
      date: "December 3, 2024",
      readTime: "12 min read",
      category: "Legal",
      image: "/blog/legal-considerations.jpg",
    },
    {
      id: 9,
      title: "Measuring Success: Key Metrics Every Campaign Creator Should Track",
      excerpt: "Beyond total raised: the analytics that matter most for understanding and improving your fundraising performance.",
      author: "Angela Foster",
      authorRole: "Data Analyst",
      date: "December 1, 2024",
      readTime: "6 min read",
      category: "Analytics",
      image: "/blog/measuring-success.jpg",
    },
  ];

  const categories = [
    { name: "All Posts", count: 127, active: true },
    { name: "Fundraising Tips", count: 34 },
    { name: "Marketing", count: 28 },
    { name: "Best Practices", count: 22 },
    { name: "Storytelling", count: 18 },
    { name: "Legal", count: 12 },
    { name: "Analytics", count: 13 },
  ];

  const stats = [
    {
      icon: BookOpen,
      value: "127",
      label: "Articles Published",
      description: "Expert insights and practical guides",
    },
    {
      icon: Users,
      value: "50K+",
      label: "Monthly Readers",
      description: "Fundraisers learning and growing",
    },
    {
      icon: TrendingUp,
      value: "92%",
      label: "Success Rate",
      description: "Readers who improve their campaigns",
    },
    {
      icon: Target,
      value: "15+",
      label: "Expert Contributors",
      description: "Industry professionals sharing knowledge",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            UdDog Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Expert insights, fundraising tips, and success stories to help you create impactful campaigns
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.slice(1, 6).map((category, index) => (
              <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Blog Stats */}
        <section className="mb-16">
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

        {/* Featured Post */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">
              Featured Article
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Must-Read Article
            </h2>
          </div>

          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Featured Article Image</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {featuredPost.category}
                  </Badge>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{featuredPost.readTime}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{featuredPost.author}</div>
                    <div className="text-sm text-gray-600">
                      {featuredPost.authorRole}
                    </div>
                  </div>
                  <div className="ml-auto text-sm text-gray-600">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {featuredPost.date}
                  </div>
                </div>

                <Button className="w-full">
                  Read Full Article
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
                className={`${
                  category.active
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-blue-50"
                }`}
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

        {/* Blog Posts Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Article Image</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-800">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-gray-700">
                      {post.readTime}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{post.author}</div>
                      <div className="text-xs text-gray-600">{post.authorRole}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {post.date}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Load More Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section>
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Get the latest fundraising tips, success stories, and platform updates
                delivered straight to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
                  Subscribe
                  <Heart className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">
                Join 50,000+ fundraisers who trust our weekly newsletter
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
