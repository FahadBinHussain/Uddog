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

  if (!campaignId || !userId) {
    console.error("Missing metadata in payment intent");
    return;
  }

  // Try to find existing donation record
  let donation = await prisma.donation.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  // If no donation record exists, create one (fallback)
  if (!donation) {
    console.log(
      `No donation record found, creating one for payment intent: ${paymentIntent.id}`,
    );

    try {
      donation = await prisma.donation.create({
        data: {
          amount: (paymentIntent.amount || 0) / 100, // Convert from cents to dollars
          campaign_id: parseInt(campaignId),
          donor_id: parseInt(userId),
          status: "completed",
          stripePaymentIntentId: paymentIntent.id,
          donationDate: new Date(),
          completedAt: new Date(),
          isRecurring: type === "recurring_donation",
          isAnonymous: false,
        },
      });
    } catch (createError) {
      console.error("Error creating donation record in webhook:", createError);
      return;
    }
  } else {
    // Update existing donation status to completed
    await prisma.donation.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
  }

  // Update campaign total if it's a one-time donation
  if (type !== "recurring_donation" && donation) {
    await prisma.campaign.update({
      where: { campaign_id: parseInt(campaignId) },
      data: {
        currentAmount: {
          increment: donation.amount,
        },
      },
    });
  }

  console.log(
    `Payment succeeded for campaign ${campaignId}, donation amount: $${donation?.amount}`,
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
