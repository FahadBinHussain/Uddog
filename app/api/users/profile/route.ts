import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        dateJoined: true,

        _count: {
          select: {
            campaigns: true,
            donations: true,
            comments: true,
          },
        },
        campaigns: {
          select: {
            campaign_id: true,
            title: true,
            status: true,
            currentAmount: true,
            goalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        donations: {
          select: {
            donation_id: true,
            amount: true,
            donationDate: true,
            isRecurring: true,
            campaign: {
              select: {
                campaign_id: true,
                title: true,
              },
            },
          },
          orderBy: {
            donationDate: "desc",
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// UPDATE current user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const updates = await request.json();
    const userId = parseInt(session.user.id);

    // Validate allowed fields for update
    const allowedFields = ["name"];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 },
      );
    }

    // Validate name length if provided
    if (filteredUpdates.name && filteredUpdates.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: filteredUpdates,
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        dateJoined: true,

        _count: {
          select: {
            campaigns: true,
            donations: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
