'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  Heart,
  MessageCircle,
  Share,
  ArrowLeft,
  Download,
  RefreshCw,
  Eye,
  Clock,
  MapPin,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatRelativeTime, formatDate } from '@/lib/utils'

interface Campaign {
  campaign_id: number
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  status: string
  createdAt: string
  endDate?: string
  category: string
  location: string
  user: {
    name: string
    email: string
  }
  _count: {
    donations: number
    comments: number
  }
}

interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    conversionRate: number
    averageDonation: number
    shareCount: number
    commentCount: number
  }
  donations: {
    totalAmount: number
    totalCount: number
    recurringCount: number
    averageAmount: number
    largestDonation: number
    recentDonations: Array<{
      amount: number
      donationDate: string
      user: { name: string }
      isRecurring: boolean
    }>
  }
  timeline: Array<{
    date: string
    donations: number
    amount: number
    views: number
  }>
  demographics: {
    byLocation: Array<{ location: string; count: number; amount: number }>
    byAmount: Array<{ range: string; count: number; percentage: number }>
  }
  performance: {
    dailyAverage: number
    weeklyTrend: number
    monthlyTrend: number
    peakDay: string
  }
}

export default function CampaignAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')

  const campaignId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/campaigns/${campaignId}/analytics`)
      return
    }
    fetchData()
  }, [campaignId, session, status, router, timeRange])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch campaign details
      const campaignResponse = await fetch(`/api/campaigns/${campaignId}`)
      if (!campaignResponse.ok) {
        throw new Error('Campaign not found')
      }

      const campaignData = await campaignResponse.json()
      const campaign = campaignData.campaign

      // Check ownership
      if (campaign.user.email !== session?.user?.email && session?.user?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view analytics for this campaign.",
          variant: "destructive"
        })
        router.push(`/campaigns/${campaignId}`)
        return
      }

      setCampaign(campaign)

      // Fetch analytics data (mock data for now - you'd implement real analytics API)
      const analyticsData: AnalyticsData = {
        overview: {
          totalViews: Math.floor(Math.random() * 5000) + 1000,
          uniqueVisitors: Math.floor(Math.random() * 2000) + 500,
          conversionRate: Math.floor(Math.random() * 10) + 2,
          averageDonation: campaign.donations?.length > 0 ? campaign.currentAmount / campaign._count.donations : 0,
          shareCount: Math.floor(Math.random() * 100) + 20,
          commentCount: campaign._count.comments
        },
        donations: {
          totalAmount: campaign.currentAmount,
          totalCount: campaign._count.donations,
          recurringCount: Math.floor(campaign._count.donations * 0.15),
          averageAmount: campaign._count.donations > 0 ? campaign.currentAmount / campaign._count.donations : 0,
          largestDonation: Math.floor(Math.random() * 500) + 100,
          recentDonations: []
        },
        timeline: generateMockTimeline(),
        demographics: {
          byLocation: [
            { location: 'United States', count: Math.floor(Math.random() * 50) + 20, amount: Math.floor(Math.random() * 2000) + 500 },
            { location: 'Canada', count: Math.floor(Math.random() * 20) + 5, amount: Math.floor(Math.random() * 800) + 200 },
            { location: 'United Kingdom', count: Math.floor(Math.random() * 15) + 5, amount: Math.floor(Math.random() * 600) + 150 },
            { location: 'Australia', count: Math.floor(Math.random() * 10) + 3, amount: Math.floor(Math.random() * 400) + 100 }
          ],
          byAmount: [
            { range: '$1 - $25', count: Math.floor(campaign._count.donations * 0.4), percentage: 40 },
            { range: '$26 - $100', count: Math.floor(campaign._count.donations * 0.35), percentage: 35 },
            { range: '$101 - $500', count: Math.floor(campaign._count.donations * 0.2), percentage: 20 },
            { range: '$500+', count: Math.floor(campaign._count.donations * 0.05), percentage: 5 }
          ]
        },
        performance: {
          dailyAverage: Math.floor(Math.random() * 100) + 20,
          weeklyTrend: Math.floor(Math.random() * 20) - 10,
          monthlyTrend: Math.floor(Math.random() * 30) - 15,
          peakDay: 'Monday'
        }
      }

      setAnalytics(analyticsData)

    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const generateMockTimeline = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const timeline = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      timeline.push({
        date: date.toISOString().split('T')[0],
        donations: Math.floor(Math.random() * 5),
        amount: Math.floor(Math.random() * 200),
        views: Math.floor(Math.random() * 50) + 10
      })
    }

    return timeline
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendDirection }: {
    icon: React.ElementType
    title: string
    value: string | number
    subtitle?: string
    trend?: string
    trendDirection?: 'up' | 'down' | 'neutral'
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                trendDirection === 'up' ? 'text-green-600' :
                trendDirection === 'down' ? 'text-red-600' :
                'text-muted-foreground'
              }`}>
                {trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend}
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!campaign || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Analytics Not Available</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load analytics data for this campaign.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progressPercentage = Math.round((campaign.currentAmount / campaign.goalAmount) * 100)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/campaigns/${campaignId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Campaign Analytics</h1>
            <p className="text-muted-foreground">{campaign.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Campaign Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{campaign.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Created {formatRelativeTime(campaign.createdAt)}
                </p>
              </div>
              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                {campaign.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(campaign.currentAmount)} raised</span>
                <span>of {formatCurrency(campaign.goalAmount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressPercentage}% funded</span>
                <span>{campaign._count.donations} donations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{campaign._count.donations}</div>
              <div className="text-sm text-muted-foreground">Total Supporters</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.donations.averageAmount)}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Donation</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Eye}
              title="Total Views"
              value={analytics.overview.totalViews.toLocaleString()}
              trend="+12% vs last period"
              trendDirection="up"
            />
            <StatCard
              icon={Users}
              title="Unique Visitors"
              value={analytics.overview.uniqueVisitors.toLocaleString()}
              trend="+8% vs last period"
              trendDirection="up"
            />
            <StatCard
              icon={Target}
              title="Conversion Rate"
              value={`${analytics.overview.conversionRate}%`}
              subtitle="Visitors to donors"
              trend="+2% vs last period"
              trendDirection="up"
            />
            <StatCard
              icon={Heart}
              title="Average Donation"
              value={formatCurrency(analytics.overview.averageDonation)}
              trend="-5% vs last period"
              trendDirection="down"
            />
          </div>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Campaign Performance
              </CardTitle>
              <CardDescription>
                Daily donations and views over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Interactive chart would be displayed here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Integration with charting library (e.g., Chart.js, Recharts)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Daily Average</span>
                  <span className="font-medium">
                    {formatCurrency(analytics.performance.dailyAverage)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Day</span>
                  <span className="font-medium">{analytics.performance.peakDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Trend</span>
                  <span className={`font-medium ${
                    analytics.performance.monthlyTrend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {analytics.performance.monthlyTrend > 0 ? '+' : ''}{analytics.performance.monthlyTrend}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Comments</span>
                  <span className="font-medium">{analytics.overview.commentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shares</span>
                  <span className="font-medium">{analytics.overview.shareCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recurring Donors</span>
                  <span className="font-medium">{analytics.donations.recurringCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Donation Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Largest Donation</span>
                  <span className="font-medium">
                    {formatCurrency(analytics.donations.largestDonation)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Donors</span>
                  <span className="font-medium">{analytics.donations.totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repeat Donors</span>
                  <span className="font-medium">
                    {Math.round((analytics.donations.recurringCount / analytics.donations.totalCount) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donation Amount Ranges */}
            <Card>
              <CardHeader>
                <CardTitle>Donations by Amount</CardTitle>
                <CardDescription>
                  Distribution of donation sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.demographics.byAmount.map((range, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{range.range}</span>
                        <span>{range.count} donors ({range.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${range.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest donations received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Anonymous Donor</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 24)} hours ago
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(Math.floor(Math.random() * 200) + 25)}
                        </p>
                        {Math.random() > 0.8 && (
                          <Badge variant="outline" className="text-xs">Recurring</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={Eye}
              title="Page Views"
              value={analytics.overview.totalViews.toLocaleString()}
              subtitle="Total campaign views"
              trend="+15% this month"
              trendDirection="up"
            />
            <StatCard
              icon={Share}
              title="Social Shares"
              value={analytics.overview.shareCount}
              subtitle="Total shares across platforms"
              trend="+8% this month"
              trendDirection="up"
            />
            <StatCard
              icon={MessageCircle}
              title="Comments"
              value={analytics.overview.commentCount}
              subtitle="Total comments received"
              trend="+12% this month"
              trendDirection="up"
            />
            <StatCard
              icon={Users}
              title="Return Visitors"
              value="24%"
              subtitle="Visitors who returned"
              trend="+3% this month"
              trendDirection="up"
            />
          </div>

          {/* Engagement Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Timeline</CardTitle>
              <CardDescription>
                Views and interactions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Engagement timeline chart would be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Donors by Location</CardTitle>
                <CardDescription>
                  Geographic distribution of supporters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.demographics.byLocation.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{location.location}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{location.count} donors</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(location.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time-based Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Activity Times</CardTitle>
                <CardDescription>
                  When your supporters are most active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Peak Day</span>
                    <Badge variant="outline">{analytics.performance.peakDay}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Peak Hour</span>
                    <Badge variant="outline">2:00 PM - 3:00 PM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Most Active Day</span>
                    <Badge variant="outline">Sunday</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <span className="font-medium">{analytics.overview.conversionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>
                Understanding your supporter base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">68%</div>
                  <div className="text-sm text-muted-foreground">Return Supporters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">32%</div>
                  <div className="text-sm text-muted-foreground">New Supporters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15%</div>
                  <div className="text-sm text-muted-foreground">Recurring Donors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
