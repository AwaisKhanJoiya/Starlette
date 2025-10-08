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

    // Create new class with calculated end time
    const classData = { ...body };
    
    // If end time is not provided, calculate it based on start time + 50 minutes
    if (!classData.endTime && classData.startTime) {
      const [hours, minutes] = classData.startTime.split(':').map(Number);
      const startDate = new Date(2000, 0, 1, hours, minutes);
      const endDate = new Date(startDate.getTime() + 50 * 60000); // Add 50 minutes
      
      // Format as HH:MM
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      classData.endTime = `${endHours}:${endMinutes}`;
    }
    
    // Set default language to Hebrew if not provided
    if (!classData.languages || classData.languages.length === 0) {
      classData.languages = ["Hebrew"];
    }
    
    // Ensure capacity doesn't exceed 5
    if (classData.capacity > 5) {
      classData.capacity = 5;
    }
    
    const newClass = new Class(classData);
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
