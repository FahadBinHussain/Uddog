import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        },
        { status: 400 },
      );
    }

    // Additional validation for empty files
    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${session.user.id}-${timestamp}.${fileExtension}`;

    // Convert file to base64 for storage (temporary solution)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // For now, we'll return the file data to be handled by the client
    // In a production environment, you would upload to your preferred storage service
    const mockUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: mockUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
      message:
        "File processed successfully. Note: Using temporary storage - implement proper cloud storage for production.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
