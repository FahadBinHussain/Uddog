'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  MapPin,
  Calendar,
  Heart,
  Target,
  DollarSign,
  TrendingUp,
  Settings,
  Edit,
  Plus,
  ExternalLink,
  Award,
  Users,
  MessageCircle
} from 'lucide-react'
import { formatCurrency, formatRelativeTime, calculatePercentage } from '@/lib/utils'

interface UserProfile {
  user_id: number
  name: string
  email: string
  role: string
  dateJoined: string
  _count: {
    campaigns: number
    donations: number
    comments: number
  }
  campaigns: Array<{
    campaign_id: number
    title: string
    status: string
    currentAmount: number
    goalAmount: number
    createdAt: string
  }>
  donations: Array<{
    donation_id: number
    amount: number
    donationDate: string
    isRecurring: boolean
    campaign: {
      campaign_id: number
      title: string
    }
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/profile')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data.profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProfile}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getTotalRaised = () => {
    return profile.campaigns.reduce((total, campaign) => total + campaign.currentAmount, 0)
  }

  const getTotalDonated = () => {
    return profile.donations.reduce((total, donation) => total + donation.amount, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
              <AvatarImage src={`/avatars/${profile.user_id}.jpg`} />
              <AvatarFallback className="text-2xl md:text-3xl font-bold bg-white text-blue-600">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
              <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-4 text-white/90">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Badge>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {formatRelativeTime(profile.dateJoined)}</span>
                </div>
              </div>
            </div>

            <div className="md:ml-auto">
              <Link href="/settings">
                <Button variant="secondary" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Campaigns</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile._count.campaigns}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Raised</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(getTotalRaised())}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Donations Made</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile._count.donations}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                      <MessageCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile._count.comments}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="donations">Donation History</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Campaigns ({profile.campaigns.length})
                </h2>
                <Link href="/campaigns/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>

              {profile.campaigns.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {profile.campaigns.map((campaign, index) => (
                    <motion.div key={campaign.campaign_id} variants={itemVariants}>
                      <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge
                              variant={campaign.status === 'active' ? 'default' : 'secondary'}
                              className="mb-2"
                            >
                              {campaign.status}
                            </Badge>
                            <Link href={`/campaigns/${campaign.campaign_id}`}>
                              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </Link>
                          </div>
                          <CardTitle className="text-lg leading-tight">
                            {campaign.title}
                          </CardTitle>
                          <CardDescription>
                            Created {formatRelativeTime(campaign.createdAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="font-medium">
                                {calculatePercentage(campaign.currentAmount, campaign.goalAmount)}%
                              </span>
                            </div>
                            <Progress
                              value={calculatePercentage(campaign.currentAmount, campaign.goalAmount)}
                              className="h-2"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Raised: {formatCurrency(campaign.currentAmount)}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                Goal: {formatCurrency(campaign.goalAmount)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="py-12 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No campaigns yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start your first fundraising campaign and make a difference.
                    </p>
                    <Link href="/campaigns/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Campaign
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Donation History ({profile.donations.length})
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Donated</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(getTotalDonated())}
                  </p>
                </div>
              </div>

              {profile.donations.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {profile.donations.map((donation, index) => (
                    <motion.div key={donation.donation_id} variants={itemVariants}>
                      <Card className="bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <Link
                                  href={`/campaigns/${donation.campaign.campaign_id}`}
                                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary"
                                >
                                  {donation.campaign.title}
                                </Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatRelativeTime(donation.donationDate)}
                                  {donation.isRecurring && (
                                    <Badge variant="outline" className="ml-2">
                                      Recurring
                                    </Badge>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">
                                {formatCurrency(donation.amount)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="py-12 text-center">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No donations yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start supporting campaigns that matter to you.
                    </p>
                    <Link href="/campaigns">
                      <Button>
                        <Heart className="w-4 h-4 mr-2" />
                        Browse Campaigns
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h2>

              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Activity Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We're working on a comprehensive activity feed to show all your interactions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
