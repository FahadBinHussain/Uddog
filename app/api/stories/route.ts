import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET impact stories for a campaign or all stories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    let where: any = {}

    if (campaignId) {
      const id = parseInt(campaignId)
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid campaign ID' },
          { status: 400 }
        )
      }
      where.campaign_id = id
    }

    const [stories, total] = await Promise.all([
      prisma.impactStory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { postedAt: 'desc' },
        include: {
          campaign: {
            select: {
              title: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),
      prisma.impactStory.count({ where })
    ])

    const hasMore = skip + limit < total
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching impact stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch impact stories' },
      { status: 500 }
    )
  }
}

// POST create new impact story
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { campaignId, title, content } = await request.json()
    const userId = parseInt(session.user.id)

    // Validation
    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required' },
        { status: 400 }
      )
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Story title is required' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Story content is required' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title cannot exceed 200 characters' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Content cannot exceed 5000 characters' },
        { status: 400 }
      )
    }

    // Check if campaign exists and user owns it
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Only campaign owner can post impact stories
    if (campaign.user_id !== userId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied. Only campaign owners can post impact stories' },
        { status: 403 }
      )
    }

    // Create impact story
    const story = await prisma.impactStory.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        campaign_id: campaignId
      },
      include: {
        campaign: {
          select: {
            title: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Impact story created successfully',
      story
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating impact story:', error)
    return NextResponse.json(
      { error: 'Failed to create impact story' },
      { status: 500 }
    )
  }
}

// PATCH update impact story
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { storyId, title, content } = await request.json()
    const userId = parseInt(session.user.id)

    if (!storyId || isNaN(storyId)) {
      return NextResponse.json(
        { error: 'Valid story ID is required' },
        { status: 400 }
      )
    }

    // Find the story and check ownership
    const story = await prisma.impactStory.findUnique({
      where: { story_id: storyId },
      include: {
        campaign: true
      }
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (story.campaign.user_id !== userId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Prepare updates
    const updates: any = {}

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Story title cannot be empty' },
          { status: 400 }
        )
      }
      if (title.length > 200) {
        return NextResponse.json(
          { error: 'Title cannot exceed 200 characters' },
          { status: 400 }
        )
      }
      updates.title = title.trim()
    }

    if (content !== undefined) {
      if (content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Story content cannot be empty' },
          { status: 400 }
        )
      }
      if (content.length > 5000) {
        return NextResponse.json(
          { error: 'Content cannot exceed 5000 characters' },
          { status: 400 }
        )
      }
      updates.content = content.trim()
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    // Update the story
    const updatedStory = await prisma.impactStory.update({
      where: { story_id: storyId },
      data: updates,
      include: {
        campaign: {
          select: {
            title: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Impact story updated successfully',
      story: updatedStory
    })

  } catch (error) {
    console.error('Error updating impact story:', error)
    return NextResponse.json(
      { error: 'Failed to update impact story' },
      { status: 500 }
    )
  }
}

// DELETE impact story
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { storyId } = await request.json()
    const userId = parseInt(session.user.id)

    if (!storyId || isNaN(storyId)) {
      return NextResponse.json(
        { error: 'Valid story ID is required' },
        { status: 400 }
      )
    }

    // Find the story and check ownership
    const story = await prisma.impactStory.findUnique({
      where: { story_id: storyId },
      include: {
        campaign: true
      }
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (story.campaign.user_id !== userId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Delete the story
    await prisma.impactStory.delete({
      where: { story_id: storyId }
    })

    return NextResponse.json({
      message: 'Impact story deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting impact story:', error)
    return NextResponse.json(
      { error: 'Failed to delete impact story' },
      { status: 500 }
    )
  }
}
