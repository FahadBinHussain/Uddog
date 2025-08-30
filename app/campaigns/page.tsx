"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  SlidersHorizontal,
  Grid,
  List,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  formatCurrency,
  calculatePercentage,
  formatRelativeTime,
  cn,
} from "@/lib/utils";
import { useCampaigns } from "@/contexts/campaign-context";

interface Campaign {
  campaign_id: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: string;
  createdAt: string;
  category?: string;
  location?: string;
  user: {
    name: string;
  };
  _count?: {
    donations: number;
  };
  isVerified?: boolean;
  images?: string[];
}

export default function CampaignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, fetchCampaigns, setSearchQuery, setFilters, resetCampaigns } =
    useCampaigns();

  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  // Get URL parameters
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialVerified = searchParams.get("verified");

  useEffect(() => {
    // Initialize from URL parameters
    if (initialSearch) {
      setSearchInput(initialSearch);
      setSearchQuery(initialSearch);
    }

    setFilters({
      category: initialCategory,
      status: initialStatus,
      location: initialLocation,
      verified:
        initialVerified === "true"
          ? true
          : initialVerified === "false"
            ? false
            : null,
    });

    // Fetch initial campaigns
    fetchCampaigns({ reset: true });
  }, [
    initialSearch,
    initialCategory,
    initialStatus,
    initialLocation,
    initialVerified,
  ]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(searchInput);
      updateURL({ search: searchInput });
      fetchCampaigns({ reset: true });
    },
    [searchInput, setSearchQuery, fetchCampaigns],
  );

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newFilters = { [key]: value };
      setFilters(newFilters);
      updateURL(newFilters);
      fetchCampaigns({ reset: true });
    },
    [setFilters, fetchCampaigns],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      // In a real implementation, you would pass sort to fetchCampaigns
      fetchCampaigns({ reset: true });
    },
    [fetchCampaigns],
  );

  const updateURL = useCallback(
    (params: Record<string, any>) => {
      const url = new URL(window.location.href);
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "") {
          url.searchParams.set(key, value.toString());
        } else {
          url.searchParams.delete(key);
        }
      });
      router.push(url.pathname + url.search);
    },
    [router],
  );

  const loadMoreCampaigns = useCallback(() => {
    if (state.pagination.hasMore && !state.loading) {
      fetchCampaigns({ page: state.pagination.page + 1 });
    }
  }, [
    state.pagination.hasMore,
    state.loading,
    state.pagination.page,
    fetchCampaigns,
  ]);

  const clearFilters = useCallback(() => {
    resetCampaigns();
    setSearchInput("");
    setSearchQuery("");
    setFilters({
      category: "",
      status: "",
      location: "",
      verified: null,
    });
    router.push("/campaigns");
  }, [resetCampaigns, setSearchQuery, setFilters, router]);

  const CampaignCard = ({
    campaign,
    viewMode,
  }: {
    campaign: Campaign;
    viewMode: "grid" | "list";
  }) => {
    const progressPercentage = calculatePercentage(
      campaign.currentAmount,
      campaign.goalAmount,
    );
    const isGridView = viewMode === "grid";

    return (
      <Card
        className={cn(
          "campaign-card hover:shadow-lg transition-all duration-300 group",
          !isGridView && "flex flex-row",
        )}
      >
        <div className={cn("relative", isGridView ? "h-48" : "w-48 h-32")}>
          {campaign.images && campaign.images.length > 0 ? (
            <img
              src={campaign.images[0]}
              alt={campaign.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center",
                isGridView ? "rounded-t-lg" : "rounded-l-lg",
              )}
            >
              <Users className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {campaign.isVerified && (
            <Badge variant="verified" className="absolute top-2 right-2">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}

          {campaign.category && (
            <Badge className="absolute top-2 left-2 bg-black/70 text-white">
              {campaign.category}
            </Badge>
          )}
        </div>

        <div className="flex-1">
          <CardHeader className={cn(!isGridView && "pb-2")}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle
                  className={cn(
                    "font-semibold line-clamp-2 group-hover:text-primary transition-colors",
                    isGridView ? "text-lg" : "text-base",
                  )}
                >
                  {campaign.title}
                </CardTitle>
                <CardDescription
                  className={cn(
                    "text-muted-foreground mt-1",
                    isGridView ? "text-sm" : "text-xs",
                  )}
                >
                  by {campaign.user.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className={cn("space-y-3", !isGridView && "py-2")}>
            <p
              className={cn(
                "text-muted-foreground line-clamp-3",
                isGridView ? "text-sm" : "text-xs",
              )}
            >
              {campaign.description}
            </p>

            {campaign.location && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {campaign.location}
              </div>
            )}

            <div className="space-y-2">
              <div
                className={cn(
                  "flex justify-between",
                  isGridView ? "text-sm" : "text-xs",
                )}
              >
                <span className="font-medium">
                  {formatCurrency(campaign.currentAmount)}
                </span>
                <span className="text-muted-foreground">
                  of {formatCurrency(campaign.goalAmount)}
                </span>
              </div>

              <Progress
                value={progressPercentage}
                className={cn(
                  "h-2",
                  progressPercentage > 75 && "progress-animated",
                )}
              />

              <div
                className={cn(
                  "flex justify-between items-center text-muted-foreground",
                  isGridView ? "text-xs" : "text-[10px]",
                )}
              >
                <span>{progressPercentage}% funded</span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {campaign._count?.donations || 0} donors
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatRelativeTime(campaign.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className={cn("pt-0", !isGridView && "pb-2")}>
            <Link
              href={`/campaigns/${campaign.campaign_id}`}
              className="w-full"
            >
              <Button
                className="w-full group-hover:bg-primary/90 transition-colors"
                size={isGridView ? "default" : "sm"}
              >
                View Campaign
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </div>
      </Card>
    );
  };

  const categories = [
    "Medical",
    "Education",
    "Emergency",
    "Community",
    "Animals",
    "Environment",
    "Sports",
    "Arts",
    "Technology",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Campaigns
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover amazing causes and make a difference in communities
              around the world
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search campaigns by title, description, or creator..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(
                  state.campaigns.reduce((sum, c) => sum + c.currentAmount, 0),
                )}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Total Raised
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {state.campaigns.filter((c) => c.status === "active").length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Active Campaigns
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {state.campaigns.reduce(
                  (sum, c) => sum + (c._count?.donations || 0),
                  0,
                )}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Total Donations
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {state.campaigns.filter((c) => c.isVerified).length}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                Verified Campaigns
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Left side - Filters */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {/* Quick filter chips */}
              {(state.searchQuery ||
                state.filters.category ||
                state.filters.verified !== null) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {state.searchQuery && (
                    <Badge variant="secondary">
                      Search: {state.searchQuery}
                    </Badge>
                  )}
                  {state.filters.category && (
                    <Badge variant="secondary">
                      Category: {state.filters.category}
                    </Badge>
                  )}
                  {state.filters.verified !== null && (
                    <Badge variant="secondary">
                      {state.filters.verified ? "Verified" : "Unverified"}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Right side - Sort and View */}
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="goal">Highest Goal</SelectItem>
                  <SelectItem value="progress">Most Progress</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={state.filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={state.filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={state.filters.verified?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "verified",
                      value === "" ? null : value === "true",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verification Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="true">Verified Only</SelectItem>
                    <SelectItem value="false">Unverified Only</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Location"
                  value={state.filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Results */}
        {state.loading && state.campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading campaigns...
            </p>
          </div>
        ) : state.error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{state.error}</p>
            <Button onClick={() => fetchCampaigns({ reset: true })}>
              Try Again
            </Button>
          </div>
        ) : state.campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or browse all campaigns
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {state.campaigns.length} of {state.pagination.total}{" "}
                campaigns
              </p>
              <Link href="/campaigns/create">
                <Button>
                  <Star className="w-4 h-4 mr-2" />
                  Start a Campaign
                </Button>
              </Link>
            </div>

            {/* Campaign Grid/List */}
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4",
              )}
            >
              {state.campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.campaign_id}
                  campaign={campaign}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Load More */}
            {state.pagination.hasMore && (
              <div className="text-center py-6">
                <Button
                  onClick={loadMoreCampaigns}
                  disabled={state.loading}
                  size="lg"
                >
                  {state.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Loading...
                    </>
                  ) : (
                    "Load More Campaigns"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
