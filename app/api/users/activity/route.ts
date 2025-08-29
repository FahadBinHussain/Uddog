import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const targetUserId = parseInt(userId);
    const currentUserId = parseInt(session.user.id);

    // Users can only view their own activity unless they're admin
    if (targetUserId !== currentUserId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Get recent activities for the user
    const activities: any[] = [];

    // Get recent donations made by the user
    const recentDonations = await prisma.donation.findMany({
      where: { donor_id: targetUserId },
      take: Math.floor(limit / 3),
      orderBy: { donationDate: "desc" },
      include: {
        campaign: {
          select: {
            title: true,
            campaign_id: true,
          },
        },
      },
    });

    recentDonations.forEach((donation) => {
      activities.push({
        type: "donation_made",
        message: `You donated $${donation.amount} to "${donation.campaign.title}"`,
        date: donation.donationDate.toISOString(),
        campaignId: donation.campaign.campaign_id,
        amount: donation.amount,
      });
    });

    // Get recent donations received by user's campaigns
    const donationsReceived = await prisma.donation.findMany({
      where: {
        campaign: {
          user_id: targetUserId,
        },
      },
      take: Math.floor(limit / 3),
      orderBy: { donationDate: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        campaign: {
          select: {
            title: true,
            campaign_id: true,
          },
        },
      },
    });

    donationsReceived.forEach((donation) => {
      activities.push({
        type: "donation_received",
        message: `${donation.user.name} donated $${donation.amount} to your campaign "${donation.campaign.title}"`,
        date: donation.donationDate.toISOString(),
        campaignId: donation.campaign.campaign_id,
        amount: donation.amount,
      });
    });

    // Get recent campaigns created
    const recentCampaigns = await prisma.campaign.findMany({
      where: { user_id: targetUserId },
      take: Math.floor(limit / 4),
      orderBy: { createdAt: "desc" },
      select: {
        campaign_id: true,
        title: true,
        createdAt: true,
      },
    });

    recentCampaigns.forEach((campaign) => {
      activities.push({
        type: "campaign_created",
        message: `You created a new campaign "${campaign.title}"`,
        date: campaign.createdAt.toISOString(),
        campaignId: campaign.campaign_id,
      });
    });

    // Get recent comments
    const recentComments = await prisma.comment.findMany({
      where: { user_id: targetUserId },
      take: Math.floor(limit / 4),
      orderBy: { createdAt: "desc" },
      include: {
        campaign: {
          select: {
            title: true,
            campaign_id: true,
          },
        },
      },
    });

    recentComments.forEach((comment) => {
      activities.push({
        type: "comment",
        message: `You commented on "${comment.campaign.title}"`,
        date: comment.createdAt.toISOString(),
        campaignId: comment.campaign.campaign_id,
      });
    });

    // Sort all activities by date and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    return NextResponse.json({
      activities: sortedActivities,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 },
    );
  }
}
