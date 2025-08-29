import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FRAUD_REPORT_STATUSES } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);
    const { campaignId, reason, description } = await request.json();

    // Validation
    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json(
        { error: "Valid campaign ID is required" },
        { status: 400 },
      );
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Report reason is required" },
        { status: 400 },
      );
    }

    if (reason.length > 200) {
      return NextResponse.json(
        { error: "Reason cannot exceed 200 characters" },
        { status: 400 },
      );
    }

    if (description && description.length > 1000) {
      return NextResponse.json(
        { error: "Description cannot exceed 1000 characters" },
        { status: 400 },
      );
    }

    // Check if campaign exists
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

    // Prevent self-reporting
    if (campaign.user_id === userId) {
      return NextResponse.json(
        { error: "You cannot report your own campaign" },
        { status: 400 },
      );
    }

    // Check if user has already reported this campaign
    const existingReport = await prisma.fraudReport.findFirst({
      where: {
        campaign_id: campaignId,
        reported_by: userId,
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this campaign" },
        { status: 400 },
      );
    }

    // Create fraud report
    const report = await prisma.fraudReport.create({
      data: {
        reason: reason.trim(),
        status: FRAUD_REPORT_STATUSES.OPEN,
        campaign_id: campaignId,
        reported_by: userId,
      },
      include: {
        reporter: {
          select: {
            name: true,
            email: true,
          },
        },
        campaign: {
          select: {
            title: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Log fraud report
    console.log(
      `Fraud report created for campaign ${campaignId} by user ${session.user.name}`,
    );

    // In production, notify admins about new fraud reports
    // await notifyAdminsOfFraudReport(report)

    return NextResponse.json(
      {
        message: "Fraud report submitted successfully",
        report: {
          report_id: report.report_id,
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt,
          campaign: {
            title: report.campaign.title,
            creator: report.campaign.user.name,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating fraud report:", error);
    return NextResponse.json(
      { error: "Failed to submit fraud report" },
      { status: 500 },
    );
  }
}

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const campaignId = searchParams.get("campaignId");
    const isAdmin = session.user.role === "admin";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Non-admin users can only see their own reports
    if (!isAdmin) {
      where.reported_by = parseInt(session.user.id);
    }

    if (
      status &&
      Object.values(FRAUD_REPORT_STATUSES).includes(status as any)
    ) {
      where.status = status;
    }

    if (campaignId && !isNaN(parseInt(campaignId))) {
      where.campaign_id = parseInt(campaignId);
    }

    const [reports, total] = await Promise.all([
      prisma.fraudReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reporter: {
            select: {
              name: true,
              email: isAdmin, // Only show email to admins
            },
          },
          campaign: {
            select: {
              title: true,
              status: true,
              currentAmount: true,
              goalAmount: true,
              user: {
                select: {
                  name: true,
                  email: isAdmin, // Only show email to admins
                },
              },
            },
          },
        },
      }),
      prisma.fraudReport.count({ where }),
    ]);

    const hasMore = skip + limit < total;

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching fraud reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch fraud reports" },
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { reportId, status, resolution } = await request.json();

    // Validation
    if (!reportId || isNaN(reportId)) {
      return NextResponse.json(
        { error: "Valid report ID is required" },
        { status: 400 },
      );
    }

    if (
      !status ||
      !Object.values(FRAUD_REPORT_STATUSES).includes(status as any)
    ) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 },
      );
    }

    if (
      status === FRAUD_REPORT_STATUSES.RESOLVED &&
      (!resolution || resolution.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: "Resolution is required when marking report as resolved" },
        { status: 400 },
      );
    }

    // Check if report exists
    const report = await prisma.fraudReport.findUnique({
      where: { report_id: reportId },
      include: {
        campaign: {
          select: {
            title: true,
            status: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Fraud report not found" },
        { status: 404 },
      );
    }

    // Update report
    const updatedReport = await prisma.fraudReport.update({
      where: { report_id: reportId },
      data: {
        status,
      },
      include: {
        reporter: {
          select: {
            name: true,
            email: true,
          },
        },
        campaign: {
          select: {
            title: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // If resolved, pause the campaign
    if (status === FRAUD_REPORT_STATUSES.RESOLVED) {
      await prisma.campaign.update({
        where: { campaign_id: report.campaign_id },
        data: { status: "paused" },
      });
    }

    console.log(
      `Fraud report ${reportId} updated to ${status} by admin ${session.user.name}`,
    );

    return NextResponse.json({
      message: "Fraud report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating fraud report:", error);
    return NextResponse.json(
      { error: "Failed to update fraud report" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");

    if (!reportId || isNaN(parseInt(reportId))) {
      return NextResponse.json(
        { error: "Valid report ID is required" },
        { status: 400 },
      );
    }

    // Check if report exists
    const report = await prisma.fraudReport.findUnique({
      where: { report_id: parseInt(reportId) },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Fraud report not found" },
        { status: 404 },
      );
    }

    // Delete report
    await prisma.fraudReport.delete({
      where: { report_id: parseInt(reportId) },
    });

    console.log(
      `Fraud report ${reportId} deleted by admin ${session.user.name}`,
    );

    return NextResponse.json({
      message: "Fraud report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fraud report:", error);
    return NextResponse.json(
      { error: "Failed to delete fraud report" },
      { status: 500 },
    );
  }
}
