import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "invoice.payment_succeeded":
        await handleSubscriptionPaymentSuccess(
          event.data.object as Stripe.Invoice,
        );
        break;

      case "invoice.payment_failed":
        await handleSubscriptionPaymentFailed(
          event.data.object as Stripe.Invoice,
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook handler failed:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { campaignId, userId, type } = paymentIntent.metadata;

  console.log(
    `🔥 WEBHOOK: Payment succeeded for payment intent: ${paymentIntent.id}`,
  );
  console.log("Payment metadata:", {
    campaignId,
    userId,
    type,
    amount: paymentIntent.amount,
  });

  if (!campaignId || !userId) {
    console.error("❌ Missing metadata in payment intent");
    return;
  }

  // Validate foreign keys exist before creating donation
  const campaignIdInt = parseInt(campaignId);
  const userIdInt = parseInt(userId);

  // Check if campaign exists
  const campaign = await prisma.campaign.findUnique({
    where: { campaign_id: campaignIdInt },
  });

  if (!campaign) {
    console.error(`❌ Campaign ${campaignIdInt} not found`);
    return;
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { user_id: userIdInt },
  });

  if (!user) {
    console.error(`❌ User ${userIdInt} not found`);
    return;
  }

  // Try to find existing donation record
  console.log(
    `🔍 Looking for existing donation record with payment intent: ${paymentIntent.id}`,
  );
  let donation = await prisma.donation.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  console.log(
    donation
      ? `✅ Found existing donation record: ${donation.donation_id}`
      : "❌ No existing donation record found",
  );

  // If no donation record exists, create one (fallback)
  if (!donation) {
    console.log(
      `🆕 No donation record found, creating one for payment intent: ${paymentIntent.id}`,
    );

    const donationData = {
      amount: (paymentIntent.amount || 0) / 100, // Convert from cents to dollars
      campaign_id: campaignIdInt,
      donor_id: userIdInt,
      status: "completed",
      stripePaymentIntentId: paymentIntent.id,
      donationDate: new Date(),
      completedAt: new Date(),
      isRecurring: type === "recurring_donation",
      isAnonymous: false,
    };

    console.log(
      "Creating donation with data:",
      JSON.stringify(donationData, null, 2),
    );

    try {
      donation = await prisma.donation.create({
        data: donationData,
      });
      console.log(
        `✅ WEBHOOK: Donation record created successfully: ${donation.donation_id}`,
      );
    } catch (createError) {
      console.error("❌ WEBHOOK: Error creating donation record:", createError);
      console.error("Database error details:", {
        name: createError instanceof Error ? createError.name : "Unknown",
        message:
          createError instanceof Error
            ? createError.message
            : String(createError),
        stack:
          createError instanceof Error ? createError.stack : "No stack trace",
      });
      return;
    }
  } else {
    // Update existing donation status to completed
    console.log(
      `⬆️ Updating existing donation ${donation.donation_id} to completed status`,
    );
    await prisma.donation.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
    console.log(`✅ Donation status updated to completed`);
  }

  // Update campaign total if it's a one-time donation
  if (type !== "recurring_donation" && donation) {
    console.log(
      `💰 Updating campaign ${campaignIdInt} total by $${donation.amount}`,
    );
    await prisma.campaign.update({
      where: { campaign_id: campaignIdInt },
      data: {
        currentAmount: {
          increment: donation.amount,
        },
      },
    });
    console.log(`✅ Campaign total updated successfully`);
  }

  console.log(
    `🎉 WEBHOOK COMPLETE: Payment succeeded for campaign ${campaignIdInt}, donation amount: $${donation?.amount}`,
  );
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { campaignId, userId } = paymentIntent.metadata;

  if (!campaignId || !userId) {
    console.error("Missing metadata in payment intent");
    return;
  }

  // Update donation status to failed
  await prisma.donation.updateMany({
    where: {
      stripePaymentIntentId: paymentIntent.id,
    },
    data: {
      status: "failed",
    },
  });

  console.log(`Payment failed for campaign ${campaignId}`);
}

async function handleSubscriptionPaymentSuccess(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );

  const { campaignId, userId } = subscription.metadata;

  if (!campaignId || !userId) {
    console.error("Missing metadata in subscription");
    return;
  }

  // Create a new donation record for the recurring payment
  const amount = (invoice.amount_paid || 0) / 100; // Convert from cents

  const donation = await prisma.donation.create({
    data: {
      campaign_id: parseInt(campaignId),
      donor_id: parseInt(userId),
      amount: amount,
      isAnonymous: false,
      status: "completed",
      completedAt: new Date(),
      stripePaymentIntentId: invoice.payment_intent as string,
      isRecurring: true,
      stripeSubscriptionId: subscription.id,
    },
  });

  // Update campaign total
  await prisma.campaign.update({
    where: { campaign_id: parseInt(campaignId) },
    data: {
      currentAmount: {
        increment: amount,
      },
    },
  });

  console.log(`Recurring payment succeeded for campaign ${campaignId}`);
}

async function handleSubscriptionPaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );

  const { campaignId, userId } = subscription.metadata;

  if (!campaignId || !userId) {
    console.error("Missing metadata in subscription");
    return;
  }

  console.log(`Recurring payment failed for campaign ${campaignId}`);

  // You might want to notify the user or retry the payment
  // For now, just log the failure
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const { campaignId, userId } = subscription.metadata;

  if (!campaignId || !userId) {
    console.error("Missing metadata in subscription");
    return;
  }

  // Update any pending donations for this subscription
  await prisma.donation.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
      status: "pending",
    },
    data: {
      status: "cancelled",
    },
  });

  console.log(`Subscription canceled for campaign ${campaignId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { campaignId, userId } = subscription.metadata;

  if (!campaignId || !userId) {
    console.error("Missing metadata in subscription");
    return;
  }

  console.log(`Subscription updated for campaign ${campaignId}`);
  // Handle subscription changes if needed
}
