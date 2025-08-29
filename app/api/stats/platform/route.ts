import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching platform stats...");

    // Start with basic counts only
    const totalCampaigns = await prisma.campaign.count();
    console.log("Total campaigns:", totalCampaigns);

    const totalDonations = await prisma.donation.count();
    console.log("Total donations:", totalDonations);

    const totalUsers = await prisma.user.count();
    console.log("Total users:", totalUsers);

    return NextResponse.json({
      totalCampaigns,
      activeCampaigns: 0,
      totalDonations,
      totalRaised: 0,
      activeDonors: totalUsers,
      verifiedCampaigns: 0,
      avgDonation: 0,
      successRate: 0,
      trends: {
        monthly: {
          campaigns: 0,
          donations: 0,
          raised: 0,
          donors: 0,
        },
        weekly: {
          campaigns: 0,
          donations: 0,
          raised: 0,
          donors: 0,
        },
      },
      categories: [],
      dailyActivity: [],
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
