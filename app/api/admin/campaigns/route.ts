import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CAMPAIGN_STATUSES, USER_ROLES } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(session.user.id) },
    });

    if (!user || user.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "pending";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { status };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Fetch pending campaigns
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              dateJoined: true,
            },
          },
          _count: {
            select: {
              donations: true,
              comments: true,
            },
          },
          verifications: {
            orderBy: { verifiedAt: "desc" },
            take: 1,
            include: {
              admin: {
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    const hasMore = skip + limit < total;

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns for admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { user_id: parseInt(session.user.id) },
    });

    if (!admin || admin.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { campaignId, action, reason } = await request.json();

    if (!campaignId || !action) {
      return NextResponse.json(
        { error: "Campaign ID and action are required" },
        { status: 400 },
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 },
      );
    }

    // Find the campaign
    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    if (campaign.status !== CAMPAIGN_STATUSES.PENDING) {
      return NextResponse.json(
        { error: "Campaign is not pending approval" },
        { status: 400 },
      );
    }

    // Update campaign status and create verification record
    const newStatus = action === "approve" ? CAMPAIGN_STATUSES.ACTIVE : CAMPAIGN_STATUSES.CANCELLED;
    const verificationStatus = action === "approve" ? "verified" : "rejected";

    await prisma.$transaction(async (tx) => {
      // Update campaign status
      await tx.campaign.update({
        where: { campaign_id: campaignId },
        data: { status: newStatus },
      });

      // Create verification record
      await tx.verification.create({
        data: {
          campaign_id: campaignId,
          verified_by: admin.user_id,
          status: verificationStatus,
          verifiedAt: new Date(),
        },
      });
    });

    // TODO: Send notification email to campaign creator
    const actionText = action === "approve" ? "approved" : "rejected";
    console.log(`Campaign "${campaign.title}" has been ${actionText} by admin ${admin.name}`);

    return NextResponse.json({
      message: `Campaign ${actionText} successfully`,
      campaign: {
        ...campaign,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error("Error processing campaign approval:", error);
    return NextResponse.json(
      { error: "Failed to process campaign approval" },
      { status: 500 },
    );
  }
}
