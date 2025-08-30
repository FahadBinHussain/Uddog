import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCampaignData, CAMPAIGN_STATUSES } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const location = searchParams.get("location") || "";
    const verified = searchParams.get("verified");
    const featured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") || "recent";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status && Object.values(CAMPAIGN_STATUSES).includes(status as any)) {
      where.status = status;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (verified === "true") {
      where.verifications = {
        some: {
          status: "verified",
        },
      };
    } else if (verified === "false") {
      where.verifications = {
        none: {
          status: "verified",
        },
      };
    }

    if (featured) {
      where.status = "active";
      where.currentAmount = { gte: 100 }; // Featured campaigns should have some donations
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" };

    switch (sort) {
      case "popular":
        orderBy = [{ currentAmount: "desc" }, { createdAt: "desc" }];
        break;
      case "goal":
        orderBy = { goalAmount: "desc" };
        break;
      case "progress":
        orderBy = [{ currentAmount: "desc" }, { goalAmount: "asc" }];
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Fetch campaigns with pagination
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              donations: true,
              comments: true,
            },
          },
          verifications: {
            where: { status: "verified" },
            take: 1,
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    // Add verification status
    const campaignsWithVerification = campaigns.map((campaign) => ({
      ...campaign,
      isVerified: campaign.verifications.length > 0,
      verifications: undefined, // Remove from response for cleaner data
    }));

    const hasMore = skip + limit < total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      campaigns: campaignsWithVerification,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Campaign creation API called");

    const session = await getServerSession(authOptions);
    console.log("Session check:", !!session, !!session?.user);

    if (!session?.user) {
      console.log("No session or user found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);
    console.log("User ID parsed:", userId, "from", session.user.id);

    const campaignData = await request.json();
    console.log(
      "Campaign data received:",
      JSON.stringify(campaignData, null, 2),
    );

    // Validate campaign data
    console.log("Starting validation...");
    const validation = validateCampaignData(campaignData);
    console.log("Validation result:", validation);

    if (!validation.isValid) {
      console.log("Validation failed:", validation.errors);
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    // Check if user can create campaigns
    console.log("Looking up user with ID:", userId);

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { user_id: userId },
      });
      console.log("User found:", !!user, user?.name);
    } catch (dbError) {
      console.error("Database error when finding user:", dbError);
      return NextResponse.json(
        {
          error: "Database connection error",
          details:
            process.env.NODE_ENV === "development"
              ? String(dbError)
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For demo purposes, allow any authenticated user to create campaigns
    // In production, you might want to restrict this to specific roles

    const {
      title,
      description,
      goalAmount,
      category,
      location,
      endDate,
      images,
    } = campaignData;

    console.log("Extracted fields:", {
      title,
      description,
      goalAmount,
      category,
    });

    // Create campaign
    console.log("Creating campaign in database...");

    let campaign;
    try {
      campaign = await prisma.campaign.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          goalAmount: parseFloat(goalAmount),
          currentAmount: 0,
          status: CAMPAIGN_STATUSES.PENDING,
          user_id: userId,
          category: category || "other",
          location: location || null,
          endDate: endDate ? new Date(endDate) : null,
          images: images || null,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              donations: true,
              comments: true,
            },
          },
        },
      });

      console.log("Campaign created successfully:", campaign.campaign_id);
    } catch (dbError) {
      console.error("Database error when creating campaign:", dbError);
      return NextResponse.json(
        {
          error: "Failed to create campaign in database",
          details:
            process.env.NODE_ENV === "development"
              ? String(dbError)
              : undefined,
        },
        { status: 500 },
      );
    }

    // Log campaign creation
    console.log(`New campaign created: ${campaign.title} by ${user.name}`);

    return NextResponse.json(
      {
        message:
          "Campaign submitted for review. It will be visible once approved by our team.",
        campaign: {
          ...campaign,
          isVerified: false,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected error creating campaign:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return NextResponse.json(
      {
        error: "Failed to create campaign",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed. Use /api/campaigns/[id] for updates" },
    { status: 405 },
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed. Use /api/campaigns/[id] for deletion" },
    { status: 405 },
  );
}
