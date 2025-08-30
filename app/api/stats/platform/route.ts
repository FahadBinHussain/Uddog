import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching platform stats...");

    // Get comprehensive platform statistics
    const [
      totalCampaigns,
      activeCampaigns,
      pendingCampaigns,
      totalDonations,
      totalRaised,
      activeDonors,
      verifiedCampaigns,
      fraudReports,
    ] = await Promise.all([
      // Total campaigns
      prisma.campaign.count(),

      // Active campaigns
      prisma.campaign.count({
        where: { status: "active" },
      }),

      // Pending campaigns
      prisma.campaign.count({
        where: { status: "pending" },
      }),

      // Total donations
      prisma.donation.count(),

      // Total amount raised
      prisma.donation.aggregate({
        _sum: { amount: true },
      }),

      // Active donors (users who have made donations)
      prisma.user.count({
        where: {
          donations: {
            some: {},
          },
        },
      }),

      // Verified campaigns
      prisma.verification.count({
        where: { status: "verified" },
      }),

      // Fraud reports count
      prisma.fraudReport.count(),
    ]);

    console.log("Platform stats calculated successfully");

    return NextResponse.json({
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      totalRaised: totalRaised._sum.amount || 0,
      activeDonors,
      verifiedCampaigns,
      pendingVerifications: pendingCampaigns,
      fraudReports,
    });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch platform statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET user-specific statistics (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const [
      userCampaigns,
      userDonationsMade,
      userDonationsReceived,
      totalRaised,
      averageRaised,
    ] = await Promise.all([
      prisma.campaign.count({
        where: { user_id: userId },
      }),
      prisma.donation.count({
        where: { donor_id: userId },
      }),
      prisma.donation.count({
        where: {
          campaign: {
            user_id: userId,
          },
        },
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: {
          campaign: {
            user_id: userId,
          },
        },
      }),
      prisma.campaign.aggregate({
        _avg: { currentAmount: true },
        where: { user_id: userId },
      }),
    ]);

    return NextResponse.json({
      campaigns: userCampaigns,
      donationsMade: userDonationsMade,
      donationsReceived: userDonationsReceived,
      totalRaised: totalRaised._sum.amount || 0,
      averageRaised: averageRaised._avg.currentAmount || 0,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 },
    );
  }
}
