import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/admin";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";

// GET all classes
export async function GET(request) {
  try {
    // Verify admin access
    await dbConnect();
    const authResult = await adminMiddleware(request);

    if (!authResult.success) {
      return authResult.response;
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Get all classes with pagination
    const classes = await Class.find()
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate("coach", "name email");

    const totalClasses = await Class.countDocuments();

    return NextResponse.json({
      classes,
      pagination: {
        total: totalClasses,
        page,
        limit,
        totalPages: Math.ceil(totalClasses / limit),
      },
    });
  } catch (error) {
    console.error("Get classes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch classes", error: error.message },
      { status: 500 }
    );
  }
}

// POST create a new class
export async function POST(request) {
  try {
    // Verify admin access
    await dbConnect();
    const authResult = await adminMiddleware(request);

    if (!authResult.success) {
      return authResult.response;
    }

    // Parse request body
    const body = await request.json();

    // Create new class
    const newClass = new Class(body);
    await newClass.save();

    return NextResponse.json(
      { message: "Class created successfully", class: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json(
      {
        message: "Failed to create class",
        error: error.message,
        details: error.errors,
      },
      { status: 500 }
    );
  }
}
