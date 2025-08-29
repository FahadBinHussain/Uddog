import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

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
    const { campaignId, amount, isRecurring = false, frequency = 'monthly', paymentMethodId } = await request.json()

    // Validation
    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required' },
        { status: 400 }
      )
    }

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Donation amount must be at least $1' },
        { status: 400 }
      )
    }

    if (amount > 10000) {
      return NextResponse.json(
        { error: 'Donation amount cannot exceed $10,000' },
        { status: 400 }
      )
    }

    if (isRecurring && !['monthly', 'quarterly', 'annually'].includes(frequency)) {
      return NextResponse.json(
        { error: 'Invalid recurring frequency' },
        { status: 400 }
      )
    }

    // Check if campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (campaign.status !== 'active') {
      return NextResponse.json(
        { error: 'Campaign is not accepting donations' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { user_id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let stripeCustomerId = user.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: userId.toString()
        }
      })

      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { user_id: userId },
        data: { stripeCustomerId }
      })
    }

    const amountInCents = Math.round(amount * 100)

    try {
      if (isRecurring) {
        // Create recurring donation with subscription
        const priceData = {
          currency: 'usd',
          product_data: {
            name: `Recurring donation to ${campaign.title}`,
            metadata: {
              campaignId: campaignId.toString(),
              userId: userId.toString()
            }
          },
          unit_amount: amountInCents,
          recurring: {
            interval: frequency === 'annually' ? 'year' :
                     frequency === 'quarterly' ? 'month' : 'month',
            interval_count: frequency === 'quarterly' ? 3 : 1
          }
        }

        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [{ price_data: priceData }],
          default_payment_method: paymentMethodId,
          expand: ['latest_invoice.payment_intent'],
          metadata: {
            campaignId: campaignId.toString(),
            userId: userId.toString(),
            type: 'recurring_donation'
          }
        })

        // Create initial donation record
        const donation = await prisma.donation.create({
          data: {
            amount,
            isRecurring: true,
            recurringFrequency: frequency,
            campaign_id: campaignId,
            user_id: userId,
            stripePaymentId: subscription.latest_invoice?.payment_intent?.id,
            stripeSubscriptionId: subscription.id,
            status: 'completed'
          },
          include: {
            campaign: {
              select: {
                title: true,
                user: { select: { name: true } }
              }
            },
            user: {
              select: { name: true, email: true }
            }
          }
        })

        // Update campaign amount
        await prisma.campaign.update({
          where: { campaign_id: campaignId },
          data: {
            currentAmount: {
              increment: amount
            }
          }
        })

        // Create recurring donation record
        const recurringDonation = {
          id: subscription.id,
          campaignId,
          amount,
          frequency,
          status: 'active',
          nextPaymentDate: new Date(subscription.current_period_end * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          campaign: {
            title: campaign.title,
            status: campaign.status
          },
          totalPaid: amount,
          paymentCount: 1
        }

        return NextResponse.json({
          message: 'Recurring donation set up successfully',
          donation,
          recurringDonation,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
        })

      } else {
        // Create one-time payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          customer: stripeCustomerId,
          payment_method: paymentMethodId,
          confirmation_method: 'manual',
          confirm: true,
          return_url: `${process.env.NEXTAUTH_URL}/campaigns/${campaignId}`,
          metadata: {
            campaignId: campaignId.toString(),
            userId: userId.toString(),
            type: 'one_time_donation'
          }
        })

        // Create donation record
        const donation = await prisma.donation.create({
          data: {
            amount,
            isRecurring: false,
            campaign_id: campaignId,
            user_id: userId,
            stripePaymentId: paymentIntent.id,
            status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending'
          },
          include: {
            campaign: {
              select: {
                title: true,
                user: { select: { name: true } }
              }
            },
            user: {
              select: { name: true, email: true }
            }
          }
        })

        // Update campaign amount if payment succeeded
        if (paymentIntent.status === 'succeeded') {
          await prisma.campaign.update({
            where: { campaign_id: campaignId },
            data: {
              currentAmount: {
                increment: amount
              }
            }
          })
        }

        return NextResponse.json({
          message: 'Donation processed successfully',
          donation,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            client_secret: paymentIntent.client_secret
          }
        })
      }

    } catch (stripeError: any) {
      console.error('Stripe payment error:', stripeError)

      return NextResponse.json(
        {
          error: 'Payment processing failed',
          details: stripeError.message
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Donation processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process donation' },
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

    const userId = parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const campaignId = searchParams.get('campaignId')

    const skip = (page - 1) * limit

    const where: any = { user_id: userId }
    if (campaignId) {
      where.campaign_id = parseInt(campaignId)
    }

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { donationDate: 'desc' },
        include: {
          campaign: {
            select: {
              title: true,
              status: true,
              user: { select: { name: true } }
            }
          }
        }
      }),
      prisma.donation.count({ where })
    ])

    const hasMore = skip + limit < total

    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}
