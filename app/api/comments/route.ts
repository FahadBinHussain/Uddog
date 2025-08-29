import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeInput } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const { campaignId, content } = await request.json()

    // Validation
    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 2000 characters' },
        { status: 400 }
      )
    }

    // Check if campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (campaign.status !== 'active') {
      return NextResponse.json(
        { error: 'Comments are not allowed on inactive campaigns' },
        { status: 400 }
      )
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeInput(content.trim())

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        campaign_id: campaignId,
        user_id: userId
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        campaign: {
          select: {
            title: true,
            user_id: true
          }
        }
      }
    })

    // Log comment creation
    console.log(`New comment on campaign ${campaignId} by ${session.user.name}`)

    return NextResponse.json({
      message: 'Comment posted successfully',
      comment
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!campaignId || isNaN(parseInt(campaignId))) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Check if campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: parseInt(campaignId) }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { campaign_id: parseInt(campaignId) },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.comment.count({
        where: { campaign_id: parseInt(campaignId) }
      })
    ])

    const hasMore = skip + limit < total

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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

    const userId = parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId || isNaN(parseInt(commentId))) {
      return NextResponse.json(
        { error: 'Valid comment ID is required' },
        { status: 400 }
      )
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { comment_id: parseInt(commentId) },
      include: {
        campaign: {
          select: {
            user_id: true
          }
        }
      }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user can delete comment (owner, campaign owner, or admin)
    const canDelete = comment.user_id === userId ||
                     comment.campaign.user_id === userId ||
                     session.user.role === 'admin'

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Delete comment
    await prisma.comment.delete({
      where: { comment_id: parseInt(commentId) }
    })

    return NextResponse.json({
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const { commentId, content } = await request.json()

    // Validation
    if (!commentId || isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Valid comment ID is required' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 2000 characters' },
        { status: 400 }
      )
    }

    // Check if comment exists and user owns it
    const comment = await prisma.comment.findUnique({
      where: { comment_id: commentId }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (comment.user_id !== userId) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      )
    }

    // Check if comment is not too old (allow editing within 24 hours)
    const commentAge = Date.now() - new Date(comment.createdAt).getTime()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (commentAge > twentyFourHours) {
      return NextResponse.json(
        { error: 'Comments can only be edited within 24 hours' },
        { status: 400 }
      )
    }

    // Sanitize content
    const sanitizedContent = sanitizeInput(content.trim())

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { comment_id: commentId },
      data: {
        content: sanitizedContent,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    })

  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}
