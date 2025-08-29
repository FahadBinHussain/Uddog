import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET all users (admin only) or current user info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const userId = searchParams.get('userId')

    // If userId is provided, return specific user (with permission check)
    if (userId) {
      const targetUserId = parseInt(userId)
      const currentUserId = parseInt(session.user.id)

      // Users can only view their own profile unless they're admin
      if (targetUserId !== currentUserId && session.user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { user_id: targetUserId },
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          dateJoined: true,
          campaigns: {
            select: {
              campaign_id: true,
              title: true,
              status: true,
              currentAmount: true,
              goalAmount: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          donations: {
            select: {
              donation_id: true,
              amount: true,
              donationDate: true,
              campaign: {
                select: {
                  title: true,
                  campaign_id: true
                }
              }
            },
            orderBy: { donationDate: 'desc' },
            take: 10
          },
          _count: {
            select: {
              campaigns: true,
              donations: true,
              comments: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ user })
    }

    // Admin-only: Get all users with pagination and filtering
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const skip = (page - 1) * limit
    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Role filter
    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateJoined: 'desc' },
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          dateJoined: true,
          _count: {
            select: {
              campaigns: true,
              donations: true,
              comments: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    const hasMore = skip + limit < total
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// UPDATE user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const updates = await request.json()
    const currentUserId = parseInt(session.user.id)
    const targetUserId = updates.userId ? parseInt(updates.userId) : currentUserId

    // Permission check - users can only update their own profile unless admin
    if (targetUserId !== currentUserId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Validate and sanitize updates
    const allowedUpdates: any = {}

    if (updates.name && typeof updates.name === 'string') {
      const name = updates.name.trim()
      if (name.length < 2 || name.length > 100) {
        return NextResponse.json(
          { error: 'Name must be between 2 and 100 characters' },
          { status: 400 }
        )
      }
      allowedUpdates.name = name
    }

    if (updates.email && typeof updates.email === 'string') {
      const email = updates.email.trim().toLowerCase()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          user_id: { not: targetUserId }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }

      allowedUpdates.email = email
    }

    // Password update (requires current password for non-admin users)
    if (updates.newPassword) {
      if (session.user.role !== 'admin' && !updates.currentPassword) {
        return NextResponse.json(
          { error: 'Current password required' },
          { status: 400 }
        )
      }

      // Validate new password strength
      if (updates.newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        )
      }

      // For non-admin users, verify current password
      if (session.user.role !== 'admin') {
        const user = await prisma.user.findUnique({
          where: { user_id: targetUserId }
        })

        if (!user || !await bcrypt.compare(updates.currentPassword, user.passwordHash)) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          )
        }
      }

      allowedUpdates.passwordHash = await bcrypt.hash(updates.newPassword, 12)
    }

    // Role update (admin only)
    if (updates.role && session.user.role === 'admin') {
      const validRoles = ['user', 'creator', 'admin']
      if (!validRoles.includes(updates.role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        )
      }
      allowedUpdates.role = updates.role
    }

    // If no valid updates provided
    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { user_id: targetUserId },
      data: allowedUpdates,
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        dateJoined: true
      }
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE user (admin only, with restrictions)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'Valid user ID required' },
        { status: 400 }
      )
    }

    const targetUserId = parseInt(userId)

    // Prevent admin from deleting themselves
    if (targetUserId === parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user has active campaigns with donations
    const userCampaigns = await prisma.campaign.findMany({
      where: { user_id: targetUserId },
      include: {
        _count: {
          select: { donations: true }
        }
      }
    })

    const campaignsWithDonations = userCampaigns.filter(
      campaign => campaign._count.donations > 0
    )

    if (campaignsWithDonations.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with active campaigns that have received donations' },
        { status: 400 }
      )
    }

    // Delete user and related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete user's comments
      await tx.comment.deleteMany({
        where: { user_id: targetUserId }
      })

      // Delete user's campaigns (only those without donations)
      await tx.campaign.deleteMany({
        where: { user_id: targetUserId }
      })

      // Delete user's donations
      await tx.donation.deleteMany({
        where: { user_id: targetUserId }
      })

      // Delete fraud reports by user
      await tx.fraudReport.deleteMany({
        where: { reported_by: targetUserId }
      })

      // Finally delete the user
      await tx.user.delete({
        where: { user_id: targetUserId }
      })
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
