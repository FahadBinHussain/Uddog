import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { email, secretKey } = await request.json();

    // For security, require a secret key to promote users to admin
    if (secretKey !== process.env.ADMIN_PROMOTION_SECRET) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Find the user to promote
    const userToPromote = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToPromote) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    // Update user role to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: USER_ROLES.ADMIN },
    });

    console.log(`User ${email} promoted to admin by ${session.user.email}`);

    return NextResponse.json({
      message: "User successfully promoted to admin",
      user: {
        id: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return NextResponse.json(
      { error: "Failed to promote user to admin" },
      { status: 500 },
    );
  }
}
