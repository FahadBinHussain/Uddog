import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/lib/utils";
import bcrypt from "bcryptjs";

/**
 * Emergency endpoint to create the first admin user
 * This endpoint is protected by environment variables and can only be used once
 * when no admin users exist in the system
 */
export async function POST(request: NextRequest) {
  try {
    // Check if this is allowed in production
    if (process.env.NODE_ENV === "production" && !process.env.ALLOW_FIRST_ADMIN_CREATION) {
      return NextResponse.json(
        { error: "This endpoint is disabled in production" },
        { status: 403 }
      );
    }

    const { adminEmail, adminPassword, secretKey } = await request.json();

    // Verify secret key for security
    if (!secretKey || secretKey !== process.env.FIRST_ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    // Check if any admin users already exist
    const existingAdminCount = await prisma.user.count({
      where: { role: USER_ROLES.ADMIN },
    });

    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: "Admin users already exist. This endpoint can only be used to create the first admin." },
        { status: 409 }
      );
    }

    // Validate input
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin email and password are required" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      // If user exists but isn't admin, promote them
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: USER_ROLES.ADMIN },
      });

      return NextResponse.json({
        message: "Existing user promoted to admin",
        admin: {
          id: updatedUser.user_id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create the first admin user
    const admin = await prisma.user.create({
      data: {
        name: "Platform Administrator",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: USER_ROLES.ADMIN,
      },
    });

    console.log(`First admin user created: ${adminEmail}`);

    return NextResponse.json({
      message: "First admin user created successfully",
      admin: {
        id: admin.user_id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Error creating first admin:", error);
    return NextResponse.json(
      { error: "Failed to create first admin user" },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint to see if first admin creation is needed
 */
export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: USER_ROLES.ADMIN },
    });

    return NextResponse.json({
      hasAdmins: adminCount > 0,
      adminCount,
      message: adminCount > 0
        ? "Admin users exist"
        : "No admin users found - first admin creation needed",
    });

  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}
