"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  calculatePercentage,
  formatRelativeTime,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCampaigns } from "@/contexts/campaign-context";

interface Campaign {
  campaign_id: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: string;
  createdAt: string;
  endDate?: string;
  _count: {
    donations: number;
    comments: number;
  };
  isVerified: boolean;
}

interface Donation {
  donation_id: number;
  amount: number;
  donationDate: string;
  isRecurring: boolean;
  campaign: {
    title: string;
    campaign_id: number;
  };
}

interface UserStats {
  campaigns: number;
  donationsMade: number;
  donationsReceived: number;
  totalRaised: number;
  averageRaised: number;
}

interface RecentActivity {
  type: "donation_received" | "donation_made" | "comment" | "campaign_created";
  message: string;
  date: string;
  campaignId?: number;
  amount?: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { deleteCampaign } = useCampaigns();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<UserStats>({
    campaigns: 0,
    donationsMade: 0,
    donationsReceived: 0,
    totalRaised: 0,
    averageRaised: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin?callbackUrl=/dashboard");
      return;
    }
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user's campaigns
      const campaignResponse = await fetch(
        `/api/campaigns?userId=${session?.user?.id}`,
      );
      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json();
        setCampaigns(campaignData.campaigns || []);
      }

      // Fetch user's donations
      const donationResponse = await fetch(
        `/api/donations?userId=${session?.user?.id}&type=made`,
      );
      if (donationResponse.ok) {
        const donationData = await donationResponse.json();
        setDonations(donationData.donations || []);
      }

      // Fetch user stats
      const statsResponse = await fetch("/api/stats/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent activity (you'll need to implement this endpoint)
      const activityResponse = await fetch(
        `/api/users/activity?userId=${session?.user?.id}`,
      );
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activities || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
  }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {trend}
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const progressPercentage = calculatePercentage(
      campaign.currentAmount,
      campaign.goalAmount,
    );
    const isActive = campaign.status === "active";
    const isExpired =
      campaign.endDate && new Date(campaign.endDate) < new Date();

    const handleDelete = async () => {
      if (campaign._count.donations > 0) {
        toast({
          title: "Cannot Delete",
          description:
            "This campaign has received donations and cannot be deleted. You can pause it instead.",
          variant: "destructive",
        });
        return;
      }

      if (
        confirm(
          "Are you sure you want to delete this campaign? This action cannot be undone.",
        )
      ) {
        try {
          await deleteCampaign(campaign.campaign_id);
          // Update local state to remove the deleted campaign
          setCampaigns((prev) =>
            prev.filter((c) => c.campaign_id !== campaign.campaign_id),
          );
        } catch (error) {
          console.error("Error deleting campaign:", error);
        }
      }
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {campaign.title}
              </CardTitle>
              <CardDescription className="text-sm">
                Created {formatRelativeTime(campaign.createdAt)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {campaign.isVerified && (
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-100"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant={isActive ? "default" : "secondary"}>
                {campaign.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
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

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium">{progressPercentage}%</p>
                <p className="text-xs text-muted-foreground">Funded</p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {campaign._count.donations}
                </p>
                <p className="text-xs text-muted-foreground">Donations</p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {campaign._count.comments}
                </p>
                <p className="text-xs text-muted-foreground">Comments</p>
              </div>
            </div>
          </div>

          {isExpired && isActive && (
            <Alert className="mt-3">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                This campaign has expired. Consider extending the deadline or
                closing it.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex gap-2">
          <Link href={`/campaigns/${campaign.campaign_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          <Link
            href={`/campaigns/${campaign.campaign_id}/edit`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link
            href={`/campaigns/${campaign.campaign_id}/analytics`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={campaign._count.donations > 0}
            className="flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const DonationCard = ({ donation }: { donation: Donation }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">
              {formatCurrency(donation.amount)}
              {donation.isRecurring && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Recurring
                </Badge>
              )}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              to {donation.campaign.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(donation.donationDate)}
            </p>
          </div>
          <Link href={`/campaigns/${donation.campaign.campaign_id}`}>
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case "donation_received":
          return <Heart className="w-4 h-4 text-green-600" />;
        case "donation_made":
          return <DollarSign className="w-4 h-4 text-blue-600" />;
        case "comment":
          return <MessageCircle className="w-4 h-4 text-purple-600" />;
        case "campaign_created":
          return <Target className="w-4 h-4 text-orange-600" />;
        default:
          return <Calendar className="w-4 h-4 text-gray-600" />;
      }
    };

    return (
      <div className="flex items-start gap-3 p-3 border-l-2 border-gray-100 hover:border-blue-200 transition-colors">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm">{activity.message}</p>
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(activity.date)}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage your campaigns and track your impact
          </p>
        </div>
        <Link href="/campaigns/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="donations">My Donations</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Target}
              title="My Campaigns"
              value={stats.campaigns}
              subtitle="Active fundraisers"
            />
            <StatCard
              icon={DollarSign}
              title="Total Raised"
              value={formatCurrency(stats.totalRaised)}
              subtitle="From all campaigns"
            />
            <StatCard
              icon={Heart}
              title="Donations Made"
              value={stats.donationsMade}
              subtitle="Supporting others"
            />
            <StatCard
              icon={Users}
              title="Donations Received"
              value={stats.donationsReceived}
              subtitle="From supporters"
            />
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/campaigns/create" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Campaign
                  </Button>
                </Link>
                <Link href="/campaigns" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Browse Campaigns
                  </Button>
                </Link>
                <Link href="/dashboard?tab=campaigns" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/settings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Campaigns</h2>
            <Link href="/campaigns/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first fundraising campaign to make a difference
                </p>
                <Link href="/campaigns/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.campaign_id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <h2 className="text-2xl font-semibold">My Donations</h2>

          {donations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start supporting campaigns you care about
                </p>
                <Link href="/campaigns">
                  <Button>
                    <Heart className="w-4 h-4 mr-2" />
                    Browse Campaigns
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.map((donation) => (
                <DonationCard key={donation.donation_id} donation={donation} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>

          <Card>
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No recent activity
                  </h3>
                  <p className="text-muted-foreground">
                    Your activity will appear here as you use the platform
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
