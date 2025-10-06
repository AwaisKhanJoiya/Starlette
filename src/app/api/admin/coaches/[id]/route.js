import dbConnect from "@/lib/mongodb";
import { validateToken } from "@/lib/auth";
import Coach from "@/models/Coach";
import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/admin";

// GET a specific coach
export async function GET(request, { params }) {
  try {
    // Connect to DB
    await dbConnect();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const coachId = params.id;
    const coach = await Coach.findById(coachId).select("-password");

    if (!coach) {
      return NextResponse.json({ message: "Coach not found" }, { status: 404 });
    }

    return NextResponse.json(coach);
  } catch (error) {
    console.error("Get coach error:", error);
    return NextResponse.json(
      { message: "Failed to fetch coach", error: error.message },
      { status: 500 }
    );
  }
}

// PUT update a coach
export async function PUT(request, { params }) {
  try {
    // Connect to DB
    await dbConnect();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const coachId = params.id;
    const body = await request.json();
    
    // Don't allow password updates through this endpoint
    if (body.password) {
      delete body.password;
    }

    const updatedCoach = await Coach.findByIdAndUpdate(
      coachId,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedCoach) {
      return NextResponse.json({ message: "Coach not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Coach updated successfully",
      coach: updatedCoach,
    });
  } catch (error) {
    console.error("Update coach error:", error);
    return NextResponse.json(
      {
        message: "Failed to update coach",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE a coach
export async function DELETE(request, { params }) {
  try {
    // Connect to DB
    await dbConnect();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const coachId = params.id;
    const deletedCoach = await Coach.findByIdAndDelete(coachId);

    if (!deletedCoach) {
      return NextResponse.json({ message: "Coach not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Coach deleted successfully",
    });
  } catch (error) {
    console.error("Delete coach error:", error);
    return NextResponse.json(
      { message: "Failed to delete coach", error: error.message },
      { status: 500 }
    );
  }
}