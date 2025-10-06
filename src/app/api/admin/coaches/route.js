import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/admin";
import Coach from "@/models/Coach";

export async function GET(request) {
  try {
    // Connect to DB
    await dbConnect();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50; // Higher limit for coach dropdown
    const skip = (page - 1) * limit;

    // Get all coaches with pagination
    const coaches = await Coach.find()
      .select("-password")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const totalCoaches = await Coach.countDocuments();

    return NextResponse.json({
      coaches,
      pagination: {
        total: totalCoaches,
        page,
        limit,
        totalPages: Math.ceil(totalCoaches / limit),
      },
    });
  } catch (error) {
    console.error("Get coaches error:", error);
    return NextResponse.json(
      { message: "Failed to fetch coaches", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Connect to DB
    await dbConnect();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Parse request body
    const body = await request.json();
    const { name, email, password, phone, bio, profileImage } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingCoach = await Coach.findOne({ email });
    if (existingCoach) {
      return NextResponse.json(
        { message: "A coach with this email already exists" },
        { status: 400 }
      );
    }

    // Create new coach
    const newCoach = new Coach({
      name,
      email,
      phone,
      password, // Will be hashed by the pre-save hook
      bio,
      profileImage,
    });

    await newCoach.save();

    // Remove password from response
    const coachResponse = newCoach.toObject();
    delete coachResponse.password;

    return NextResponse.json(
      { message: "Coach created successfully", coach: coachResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create coach error:", error);
    return NextResponse.json(
      {
        message: "Failed to create coach",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
