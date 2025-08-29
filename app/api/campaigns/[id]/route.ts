import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateCampaignData, CAMPAIGN_STATUSES } from '@/lib/utils'

// GET single campaign
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id)

    if (isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        donations: {
          select: {
            donation_id: true,
            amount: true,
            donationDate: true,
            isRecurring: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: { donationDate: 'desc' },
          take: 10
        },
        comments: {
          select: {
            comment_id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        impactStories: {
          select: {
            story_id: true,
            title: true,
            content: true,
            postedAt: true
          },
          orderBy: { postedAt: 'desc' }
        },
        verifications: {
          where: { status: 'verified' },
          include: {
            admin: {
              select: {
                name: true
              }
            }
          },
          take: 1
        },
        _count: {
          select: {
            donations: true,
            comments: true,
            fraudReports: true
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Add verification status
    const campaignWithVerification = {
      ...campaign,
      isVerified: campaign.verifications.length > 0,
      verificationInfo: campaign.verifications[0] || null
    }

    return NextResponse.json({
      campaign: campaignWithVerification
    })

  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

// UPDATE campaign
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const campaignId = parseInt(params.id)
    const userId = parseInt(session.user.id)

    if (isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    // Check if campaign exists and user has permission
    const existingCampaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId }
    })

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Check ownership or admin role
    if (existingCampaign.user_id !== userId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const updates = await request.json()

    // Validate updates if they include campaign data
    if (updates.title || updates.description || updates.goalAmount) {
      const validation = validateCampaignData({ ...existingCampaign, ...updates })
      if (!validation.isValid) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.errors },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (updates.title) updateData.title = updates.title.trim()
    if (updates.description) updateData.description = updates.description.trim()
    if (updates.goalAmount) updateData.goalAmount = parseFloat(updates.goalAmount)
    if (updates.status && Object.values(CAMPAIGN_STATUSES).includes(updates.status)) {
      updateData.status = updates.status
    }
    if (updates.category) updateData.category = updates.category
    if (updates.location) updateData.location = updates.location
    if (updates.endDate) updateData.endDate = new Date(updates.endDate)
    if (updates.images) updateData.images = updates.images

    // Update campaign
    const updatedCampaign = await prisma.campaign.update({
      where: { campaign_id: campaignId },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            donations: true,
            comments: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Campaign updated successfully',
      campaign: updatedCampaign
    })

  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// DELETE campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const campaignId = parseInt(params.id)
    const userId = parseInt(session.user.id)

    if (isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    // Check if campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        _count: {
          select: {
            donations: true
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Check ownership or admin role
    if (campaign.user_id !== userId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Prevent deletion if campaign has donations
    if (campaign._count.donations > 0) {
      return NextResponse.json(
        { error: 'Cannot delete campaign with existing donations' },
        { status: 400 }
      )
    }

    // Delete related records first (due to foreign key constraints)
    await prisma.$transaction(async (tx) => {
      // Delete comments
      await tx.comment.deleteMany({
        where: { campaign_id: campaignId }
      })

      // Delete impact stories
      await tx.impactStory.deleteMany({
        where: { campaign_id: campaignId }
      })

      // Delete verifications
      await tx.verification.deleteMany({
        where: { campaign_id: campaignId }
      })

      // Delete fraud reports
      await tx.fraudReport.deleteMany({
        where: { campaign_id: campaignId }
      })

      // Finally delete the campaign
      await tx.campaign.delete({
        where: { campaign_id: campaignId }
      })
    })

    return NextResponse.json({
      message: 'Campaign deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
