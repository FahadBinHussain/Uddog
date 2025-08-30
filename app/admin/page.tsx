"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Flag,
  BarChart3,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PlatformStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalDonations: number;
  totalRaised: number;
  activeDonors: number;
  verifiedCampaigns: number;
  pendingVerifications: number;
  fraudReports: number;
}

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
    email: string;
  };
  isVerified: boolean;
  _count: {
    donations: number;
    fraudReports: number;
  };
}

interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
  dateJoined: string;
  _count: {
    campaigns: number;
    donations: number;
    comments: number;
  };
}

interface FraudReport {
  report_id: number;
  reason: string;
  createdAt: string;
  status: string;
  campaign: {
    title: string;
    campaign_id: number;
  };
  reporter: {
    name: string;
  };
}

interface VerificationRequest {
  verification_id: number;
  campaign: {
    campaign_id: number;
    title: string;
    user: {
      name: string;
    };
  };
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState<PlatformStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonations: 0,
    totalRaised: 0,
    activeDonors: 0,
    verifiedCampaigns: 0,
    pendingVerifications: 0,
    fraudReports: 0,
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [fraudReports, setFraudReports] = useState<FraudReport[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Pagination states
  const [campaignPage, setCampaignPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin?callbackUrl=/admin");
      return;
    }
    if (session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch platform statistics
      const statsResponse = await fetch("/api/stats/platform");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch campaigns
      const campaignsResponse = await fetch(
        `/api/campaigns?page=${campaignPage}&limit=10`,
      );
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.campaigns);
      }

      // Fetch users
      const usersResponse = await fetch(`/api/users?page=${userPage}&limit=10`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      // Fetch fraud reports
      const reportsResponse = await fetch(
        `/api/reports?page=${reportPage}&limit=10`,
      );
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setFraudReports(reportsData.reports);
      }

      // Fetch pending campaigns for verification
      const verificationResponse = await fetch(
        "/api/admin/campaigns?status=pending",
      );
      if (verificationResponse.ok) {
        const verificationData = await verificationResponse.json();
        setVerificationRequests(
          verificationData.campaigns.map((campaign: any) => ({
            verification_id: campaign.campaign_id,
            status: "pending",
            createdAt: campaign.createdAt,
            campaign: campaign,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCampaign = async (campaignId: number, approve: boolean) => {
    try {
      const response = await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          action: approve ? "approve" : "reject",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process verification");
      }

      toast({
        title: "Success",
        description: `Campaign ${approve ? "approved" : "rejected"} successfully.`,
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Error processing verification:", error);
      toast({
        title: "Error",
        description: "Failed to process verification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast({
        title: "Success",
        description: "User role updated successfully.",
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResolveReport = async (
    reportId: number,
    action: "resolve" | "dismiss",
  ) => {
    try {
      const response = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          status: action === "resolve" ? "resolved" : "dismissed",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve report");
      }

      toast({
        title: "Success",
        description: `Report ${action === "resolve" ? "resolved" : "dismissed"} successfully.`,
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Error resolving report:", error);
      toast({
        title: "Error",
        description: "Failed to resolve report. Please try again.",
        variant: "destructive",
      });
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
            {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage the platform and monitor activity
          </p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Shield className="w-4 h-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Target}
              title="Total Campaigns"
              value={stats.totalCampaigns}
              subtitle={`${stats.activeCampaigns} active`}
            />
            <StatCard
              icon={DollarSign}
              title="Total Raised"
              value={formatCurrency(stats.totalRaised)}
              subtitle={`${stats.totalDonations} donations`}
            />
            <StatCard
              icon={Users}
              title="Active Donors"
              value={stats.activeDonors}
              subtitle="Platform users"
            />
            <StatCard
              icon={CheckCircle}
              title="Verified Campaigns"
              value={stats.verifiedCampaigns}
              subtitle={`${stats.pendingVerifications} pending`}
            />
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Pending Verifications</span>
                  <Badge variant="outline">{stats.pendingVerifications}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fraud Reports</span>
                  <Badge variant="destructive">{stats.fraudReports}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Inactive Campaigns</span>
                  <Badge variant="secondary">
                    {stats.totalCampaigns - stats.activeCampaigns}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Verification Rate</span>
                  <Badge variant="outline">
                    {stats.totalCampaigns > 0
                      ? Math.round(
                          (stats.verifiedCampaigns / stats.totalCampaigns) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average per Campaign</span>
                  <Badge variant="outline">
                    {stats.totalCampaigns > 0
                      ? formatCurrency(stats.totalRaised / stats.totalCampaigns)
                      : "$0"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Campaign Rate</span>
                  <Badge variant="outline">
                    {stats.totalCampaigns > 0
                      ? Math.round(
                          (stats.activeCampaigns / stats.totalCampaigns) * 100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Campaign Management</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.campaign_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {campaign.status}
                        </Badge>
                        {campaign.isVerified && (
                          <Badge
                            variant="outline"
                            className="text-green-700 bg-green-100"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {campaign._count.fraudReports > 0 && (
                          <Badge variant="destructive">
                            <Flag className="w-3 h-3 mr-1" />
                            {campaign._count.fraudReports} Reports
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {campaign.user.name} •{" "}
                        {formatRelativeTime(campaign.createdAt)}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          {formatCurrency(campaign.currentAmount)} /{" "}
                          {formatCurrency(campaign.goalAmount)}
                        </span>
                        <span>{campaign._count.donations} donations</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {!campaign.isVerified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleVerifyCampaign(campaign.campaign_id, true)
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.user_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge
                          variant={
                            user.role === "admin" ? "destructive" : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Joined {formatRelativeTime(user.dateJoined)}
                      </p>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span>{user._count.campaigns} campaigns</span>
                        <span>{user._count.donations} donations</span>
                        <span>{user._count.comments} comments</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(newRole) =>
                          handleUpdateUserRole(user.user_id, newRole)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="creator">Creator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Fraud Reports</h2>
            <Badge variant="destructive">
              {fraudReports.filter((r) => r.status === "pending").length}{" "}
              Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {fraudReports.map((report) => (
              <Card key={report.report_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {report.campaign.title}
                        </h3>
                        <Badge
                          variant={
                            report.status === "pending"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reported by {report.reporter.name} •{" "}
                        {formatRelativeTime(report.createdAt)}
                      </p>
                      <p className="text-sm mb-3">{report.reason}</p>
                    </div>
                    {report.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleResolveReport(report.report_id, "resolve")
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleResolveReport(report.report_id, "dismiss")
                          }
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Campaign Verifications</h2>
            <Badge variant="outline">
              {
                verificationRequests.filter((r) => r.status === "pending")
                  .length
              }{" "}
              Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {verificationRequests.map((request) => (
              <Card key={request.verification_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {request.campaign.title}
                        </h3>
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {request.campaign.user.name} •{" "}
                        {formatRelativeTime(request.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Goal: {formatCurrency(request.campaign.goalAmount)} •
                        Category: {request.campaign.category}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {request.campaign.description.substring(0, 150)}...
                      </p>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleVerifyCampaign(
                              request.campaign.campaign_id,
                              true,
                            )
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleVerifyCampaign(
                              request.campaign.campaign_id,
                              false,
                            )
                          }
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
