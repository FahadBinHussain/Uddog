"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Shield,
} from "lucide-react";
import {
  formatCurrency,
  calculatePercentage,
  formatRelativeTime,
} from "@/lib/utils";

interface Campaign {
  campaign_id: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
  };
  _count?: {
    donations: number;
  };
  isVerified?: boolean;
}

interface Stats {
  totalCampaigns: number;
  totalDonations: number;
  totalRaised: number;
  activeDonors: number;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    totalDonations: 0,
    totalRaised: 0,
    activeDonors: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);

      // Fetch featured campaigns
      const featuredResponse = await fetch(
        "/api/campaigns?featured=true&limit=6",
      );
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();
        setFeaturedCampaigns(featuredData.campaigns || []);
      }

      // Fetch recent campaigns
      const recentResponse = await fetch("/api/campaigns?limit=8&sort=recent");
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setCampaigns(recentData.campaigns || []);
      }

      // Fetch platform stats
      const statsResponse = await fetch("/api/stats/platform");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/campaigns?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const progressPercentage = calculatePercentage(
      campaign.currentAmount,
      campaign.goalAmount,
    );

    return (
      <Card className="campaign-card hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {campaign.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                by {campaign.user.name}
              </CardDescription>
            </div>
            {campaign.isVerified && (
              <Badge variant="verified" className="ml-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {campaign.description}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {formatCurrency(campaign.currentAmount)}
              </span>
              <span className="text-muted-foreground">
                of {formatCurrency(campaign.goalAmount)}
              </span>
            </div>

            <Progress value={progressPercentage} className="h-2" />

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{progressPercentage}% funded</span>
              <span>{campaign._count?.donations || 0} donations</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link href={`/campaigns/${campaign.campaign_id}`} className="w-full">
            <Button className="w-full group-hover:bg-primary/90 transition-colors">
              View Campaign
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend?: string;
  }) => (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <Icon className="w-8 h-8 text-primary opacity-80" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="fundraising-hero py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              Make a Difference Today
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Join thousands of people supporting causes they care about. Every
              donation counts.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-400"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for campaigns, causes, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-white/50"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
              <Link href="/campaigns">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 px-8"
                >
                  Browse Campaigns
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              {session ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                  >
                    My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/campaigns/create">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                  >
                    Start a Campaign
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Target}
              label="Active Campaigns"
              value={stats.totalCampaigns.toLocaleString()}
              trend="+12% this month"
            />
            <StatCard
              icon={DollarSign}
              label="Total Raised"
              value={formatCurrency(stats.totalRaised)}
              trend="+28% this month"
            />
            <StatCard
              icon={Users}
              label="Active Donors"
              value={stats.activeDonors.toLocaleString()}
              trend="+15% this month"
            />
            <StatCard
              icon={Heart}
              label="Total Donations"
              value={stats.totalDonations.toLocaleString()}
              trend="+22% this month"
            />
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured Campaigns
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover amazing causes that are making a real impact in
                communities around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.campaign_id} campaign={campaign} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/campaigns?featured=true">
                <Button size="lg" variant="outline">
                  View All Featured Campaigns
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Campaigns */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Recent Campaigns
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support the latest causes and help make a difference from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {campaigns.slice(0, 8).map((campaign) => (
              <CampaignCard key={campaign.campaign_id} campaign={campaign} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/campaigns">
              <Button size="lg">
                View All Campaigns
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How UdDog Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to start fundraising or support causes
              you care about.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Start a Campaign</h3>
              <p className="text-muted-foreground">
                Create your fundraising campaign with our easy-to-use tools. Add
                photos, describe your cause, and set your goal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share & Promote</h3>
              <p className="text-muted-foreground">
                Share your campaign with friends, family, and social networks.
                Use our built-in sharing tools to reach more people.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Donations</h3>
              <p className="text-muted-foreground">
                Get verified and start receiving secure donations. Track your
                progress and share updates with supporters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Whether you're raising funds for a cause or supporting others, UdDog
            makes it simple and secure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                <Link href="/campaigns/create">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8"
                  >
                    Create Campaign
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                  >
                    View Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
