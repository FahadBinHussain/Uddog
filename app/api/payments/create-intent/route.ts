import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Check if Stripe is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is not configured");
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            "Payment processing is not configured. Please contact support.",
        },
        { status: 503 },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);
    const { amount, campaignId, currency = "usd" } = await request.json();

    // Validation
    if (!amount || amount < 100) {
      // $1.00 minimum
      return NextResponse.json(
        { error: "Amount must be at least $1.00" },
        { status: 400 },
      );
    }

    if (amount > 1000000) {
      // $10,000 maximum
      return NextResponse.json(
        { error: "Amount cannot exceed $10,000" },
        { status: 400 },
      );
    }

    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json(
        { error: "Valid campaign ID is required" },
        { status: 400 },
      );
    }

    // Verify campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    if (campaign.status !== "active") {
      return NextResponse.json(
        { error: "Campaign is not accepting donations" },
        { status: 400 },
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: userId.toString(),
          },
        });

        stripeCustomerId = customer.id;

        // Update user with Stripe customer ID
        await prisma.user.update({
          where: { user_id: userId },
          data: { stripeCustomerId },
        });
      } catch (stripeError) {
        console.error("Error creating Stripe customer:", stripeError);
        return NextResponse.json(
          { error: "Failed to create payment customer. Please try again." },
          { status: 500 },
        );
      }
    }

    // Create payment intent
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: stripeCustomerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          campaignId: campaignId.toString(),
          userId: userId.toString(),
          campaignTitle: campaign.title,
          donorName: user.name,
        },
        description: `Donation to ${campaign.title}`,
        receipt_email: user.email,
        setup_future_usage: "off_session", // For potential future recurring donations
      });
    } catch (stripeError) {
      console.error("Error creating payment intent:", stripeError);
      return NextResponse.json(
        { error: "Failed to create payment intent. Please try again." },
        { status: 500 },
      );
    }

    // Log payment intent creation
    console.log(
      `Payment intent created: ${paymentIntent.id} for campaign: ${campaign.title}`,
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      campaign: {
        id: campaign.campaign_id,
        title: campaign.title,
        creatorName: campaign.user.name,
      },
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: "Payment service error",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Please try again later",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
