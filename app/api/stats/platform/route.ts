import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get current date and date ranges for trend calculations
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch platform statistics in parallel
    const [
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      totalRaised,
      activeDonors,
      verifiedCampaigns,
      // Trend data
      campaignsThisMonth,
      donationsThisMonth,
      raisedThisMonth,
      donorsThisMonth,
      campaignsThisWeek,
      donationsThisWeek,
      raisedThisWeek,
      donorsThisWeek
    ] = await Promise.all([
      // Current totals
      prisma.campaign.count(),
      prisma.campaign.count({
        where: { status: 'active' }
      }),
      prisma.donation.count(),
      prisma.donation.aggregate({
        _sum: { amount: true }
      }),
      prisma.user.count({
        where: {
          donations: {
            some: {}
          }
        }
      }),
      prisma.campaign.count({
        where: {
          verifications: {
            some: {
              status: 'verified'
            }
          }
        }
      }),

      // Monthly trends
      prisma.campaign.count({
        where: {
          createdAt: {
            gte: oneMonthAgo
          }
        }
      }),
      prisma.donation.count({
        where: {
          donationDate: {
            gte: oneMonthAgo
          }
        }
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: {
          donationDate: {
            gte: oneMonthAgo
          }
        }
      }),
      prisma.user.count({
        where: {
          donations: {
            some: {
              donationDate: {
                gte: oneMonthAgo
              }
            }
          }
        }
      }),

      // Weekly trends
      prisma.campaign.count({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        }
      }),
      prisma.donation.count({
        where: {
          donationDate: {
            gte: oneWeekAgo
          }
        }
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: {
          donationDate: {
            gte: oneWeekAgo
          }
        }
      }),
      prisma.user.count({
        where: {
          donations: {
            some: {
              donationDate: {
                gte: oneWeekAgo
              }
            }
          }
        }
      })
    ])

    // Calculate category distribution
    const categoryStats = await prisma.campaign.groupBy({
      by: ['category'],
      _count: {
        campaign_id: true
      },
      _sum: {
        currentAmount: true
      }
    })

    // Calculate average donation amount
    const avgDonation = totalDonations > 0 ?
      (totalRaised._sum.amount || 0) / totalDonations : 0

    // Calculate success rate (campaigns that reached >80% of goal)
    const successfulCampaigns = await prisma.campaign.count({
      where: {
        currentAmount: {
          gte: prisma.$queryRaw`"goalAmount" * 0.8`
        }
      }
    })

    const successRate = totalCampaigns > 0 ?
      (successfulCampaigns / totalCampaigns) * 100 : 0

    // Get top categories
    const topCategories = categoryStats
      .sort((a, b) => b._count.campaign_id - a._count.campaign_id)
      .slice(0, 5)
      .map(cat => ({
        category: cat.category,
        campaigns: cat._count.campaign_id,
        totalRaised: cat._sum.currentAmount || 0
      }))

    // Recent activity - last 30 days daily breakdown
    const dailyActivity = await prisma.$queryRaw`
      SELECT
        DATE(donation_date) as date,
        COUNT(*) as donations,
        SUM(amount) as amount
      FROM "Donation"
      WHERE donation_date >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(donation_date)
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{
      date: string
      donations: number
      amount: number
    }>

    return NextResponse.json({
      // Main statistics
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      totalRaised: totalRaised._sum.amount || 0,
      activeDonors,
      verifiedCampaigns,
      avgDonation,
      successRate: Math.round(successRate * 100) / 100,

      // Trends
      trends: {
        monthly: {
          campaigns: campaignsThisMonth,
          donations: donationsThisMonth,
          raised: raisedThisMonth._sum.amount || 0,
          donors: donorsThisMonth
        },
        weekly: {
          campaigns: campaignsThisWeek,
          donations: donationsThisWeek,
          raised: raisedThisWeek._sum.amount || 0,
          donors: donorsThisWeek
        }
      },

      // Category breakdown
      categories: topCategories,

      // Daily activity for charts
      dailyActivity: dailyActivity.reverse() // Show chronological order
    })

  } catch (error) {
    console.error('Error fetching platform stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    )
  }
}

// GET user-specific statistics (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const [
      userCampaigns,
      userDonationsMade,
      userDonationsReceived,
      totalRaised,
      averageRaised
    ] = await Promise.all([
      prisma.campaign.count({
        where: { user_id: userId }
      }),
      prisma.donation.count({
        where: { user_id: userId }
      }),
      prisma.donation.count({
        where: {
          campaign: {
            user_id: userId
          }
        }
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: {
          campaign: {
            user_id: userId
          }
        }
      }),
      prisma.campaign.aggregate({
        _avg: { currentAmount: true },
        where: { user_id: userId }
      })
    ])

    return NextResponse.json({
      campaigns: userCampaigns,
      donationsMade: userDonationsMade,
      donationsReceived: userDonationsReceived,
      totalRaised: totalRaised._sum.amount || 0,
      averageRaised: averageRaised._avg.currentAmount || 0
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}
