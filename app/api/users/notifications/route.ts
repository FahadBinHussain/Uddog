import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET notification settings
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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const targetUserId = parseInt(userId)
    const currentUserId = parseInt(session.user.id)

    // Users can only view their own settings unless they're admin
    if (targetUserId !== currentUserId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // For now, we'll return default settings
    // In a real implementation, you'd store these in the database
    const defaultSettings = {
      emailNotifications: true,
      campaignUpdates: true,
      donationAlerts: true,
      marketingEmails: false,
      weeklyDigest: true
    }

    // You could add a NotificationSettings table to store user preferences
    // const settings = await prisma.notificationSettings.findUnique({
    //   where: { user_id: targetUserId }
    // })

    return NextResponse.json({
      settings: defaultSettings
    })

  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    )
  }
}

// UPDATE notification settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { userId, settings } = await request.json()

    if (!userId || !settings) {
      return NextResponse.json(
        { error: 'User ID and settings are required' },
        { status: 400 }
      )
    }

    const targetUserId = parseInt(userId)
    const currentUserId = parseInt(session.user.id)

    // Users can only update their own settings unless they're admin
    if (targetUserId !== currentUserId && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Validate settings structure
    const requiredFields = [
      'emailNotifications',
      'campaignUpdates',
      'donationAlerts',
      'marketingEmails',
      'weeklyDigest'
    ]

    for (const field of requiredFields) {
      if (typeof settings[field] !== 'boolean') {
        return NextResponse.json(
          { error: `Invalid value for ${field}. Must be boolean.` },
          { status: 400 }
        )
      }
    }

    // In a real implementation, you'd save to database
    // const updatedSettings = await prisma.notificationSettings.upsert({
    //   where: { user_id: targetUserId },
    //   update: settings,
    //   create: {
    //     user_id: targetUserId,
    //     ...settings
    //   }
    // })

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      settings: settings
    })

  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    )
  }
}

// Send notification (internal API for system use)
export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, campaignId, metadata } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user's notification preferences
    // const settings = await prisma.notificationSettings.findUnique({
    //   where: { user_id: parseInt(userId) }
    // })

    // Check if user has enabled this type of notification
    const defaultSettings = {
      emailNotifications: true,
      campaignUpdates: true,
      donationAlerts: true,
      marketingEmails: false,
      weeklyDigest: true
    }

    let shouldSend = true

    switch (type) {
      case 'campaign_update':
        shouldSend = defaultSettings.campaignUpdates && defaultSettings.emailNotifications
        break
      case 'donation_received':
        shouldSend = defaultSettings.donationAlerts && defaultSettings.emailNotifications
        break
      case 'marketing':
        shouldSend = defaultSettings.marketingEmails && defaultSettings.emailNotifications
        break
      case 'weekly_digest':
        shouldSend = defaultSettings.weeklyDigest && defaultSettings.emailNotifications
        break
      default:
        shouldSend = defaultSettings.emailNotifications
    }

    if (!shouldSend) {
      return NextResponse.json({
        message: 'Notification not sent due to user preferences',
        sent: false
      })
    }

    // Get user email
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(userId) },
      select: { email: true, name: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // In a real implementation, you'd send the actual notification
    // This could be through email service, push notifications, etc.

    // Example email notification logic:
    // await sendEmail({
    //   to: user.email,
    //   subject: title,
    //   html: generateEmailTemplate(type, {
    //     userName: user.name,
    //     title,
    //     message,
    //     campaignId,
    //     metadata
    //   })
    // })

    // You might also store the notification in database for in-app notifications
    // await prisma.notification.create({
    //   data: {
    //     user_id: parseInt(userId),
    //     type,
    //     title,
    //     message,
    //     campaign_id: campaignId ? parseInt(campaignId) : null,
    //     metadata: metadata || {},
    //     read: false
    //   }
    // })

    console.log(`Notification sent to ${user.email}: ${title}`)

    return NextResponse.json({
      message: 'Notification sent successfully',
      sent: true,
      recipient: user.email
    })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
