import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VERIFICATION_STATUSES } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const adminId = parseInt(session.user.id)
    const { campaignId, status, reason } = await request.json()

    // Validation
    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required' },
        { status: 400 }
      )
    }

    if (!status || !Object.values(VERIFICATION_STATUSES).includes(status)) {
      return NextResponse.json(
        { error: 'Valid verification status is required' },
        { status: 400 }
      )
    }

    if (status === 'rejected' && (!reason || reason.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Reason is required when rejecting a campaign' },
        { status: 400 }
      )
    }

    // Check if campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        verifications: {
          orderBy: { verifiedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Check if campaign is already verified with the same status
    const latestVerification = campaign.verifications[0]
    if (latestVerification && latestVerification.status === status) {
      return NextResponse.json(
        { error: `Campaign is already ${status}` },
        { status: 400 }
      )
    }

    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        status,
        reason: reason?.trim() || null,
        campaign_id: campaignId,
        verified_by: adminId
      },
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        },
        campaign: {
          select: {
            title: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Update campaign status if needed
    if (status === 'rejected') {
      await prisma.campaign.update({
        where: { campaign_id: campaignId },
        data: { status: 'paused' }
      })
    }

    // Log verification action
    console.log(`Campaign ${campaignId} ${status} by admin ${session.user.name}`)

    // In a real application, you would send notification emails here
    // await sendVerificationEmail(campaign.user.email, status, campaign.title, reason)

    return NextResponse.json({
      message: `Campaign ${status} successfully`,
      verification: {
        verification_id: verification.verification_id,
        status: verification.status,
        reason: verification.reason,
        verifiedAt: verification.verifiedAt,
        admin: verification.admin,
        campaign: {
          title: verification.campaign.title,
          creator: verification.campaign.user
        }
      }
    })

  } catch (error) {
    console.error('Error processing verification:', error)
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const pending = searchParams.get('pending') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (pending) {
      // Get campaigns that need verification (no verification records or latest is pending)
      where.OR = [
        { verifications: { none: {} } },
        {
          verifications: {
            some: {
              status: 'pending'
            },
            none: {
              status: { in: ['verified', 'rejected'] }
            }
          }
        }
      ]
      where.status = 'active' // Only active campaigns need verification
    } else if (status && Object.values(VERIFICATION_STATUSES).includes(status)) {
      where.verifications = {
        some: { status }
      }
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          verifications: {
            orderBy: { verifiedAt: 'desc' },
            take: 1,
            include: {
              admin: {
                select: {
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              donations: true,
              comments: true,
              fraudReports: true
            }
          }
        }
      }),
      prisma.campaign.count({ where })
    ])

    const campaignsWithVerificationStatus = campaigns.map(campaign => ({
      ...campaign,
      latestVerification: campaign.verifications[0] || null,
      verificationStatus: campaign.verifications[0]?.status || 'pending',
      isVerified: campaign.verifications[0]?.status === 'verified'
    }))

    const hasMore = skip + limit < total

    return NextResponse.json({
      campaigns: campaignsWithVerificationStatus,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching campaigns for verification:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const verificationId = searchParams.get('verificationId')

    if (!verificationId || isNaN(parseInt(verificationId))) {
      return NextResponse.json(
        { error: 'Valid verification ID is required' },
        { status: 400 }
      )
    }

    // Check if verification exists
    const verification = await prisma.verification.findUnique({
      where: { verification_id: parseInt(verificationId) }
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      )
    }

    // Delete verification (this will revert the campaign to unverified status)
    await prisma.verification.delete({
      where: { verification_id: parseInt(verificationId) }
    })

    console.log(`Verification ${verificationId} deleted by admin ${session.user.name}`)

    return NextResponse.json({
      message: 'Verification deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting verification:', error)
    return NextResponse.json(
      { error: 'Failed to delete verification' },
      { status: 500 }
    )
  }
}
