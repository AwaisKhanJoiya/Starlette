import dbConnect from "@/lib/mongodb";
import Coach from "@/models/Coach";
import Class from "@/models/Class";
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

    // First, check if the coach exists
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return NextResponse.json({ message: "Coach not found" }, { status: 404 });
    }

    // Find all classes assigned to this coach
    const classesAssignedToCoach = await Class.find({ coach: coachId });
    const classIds = classesAssignedToCoach.map((cls) => cls._id);

    // Delete all classes assigned to this coach
    // This will also remove all enrollment links as they are embedded in the class documents
    const deleteResult = await Class.deleteMany({ coach: coachId });

    // Delete the coach
    const deletedCoach = await Coach.findByIdAndDelete(coachId);

    return NextResponse.json({
      message: "Coach deleted successfully",
      deletedClasses: deleteResult.deletedCount,
      classIds: classIds,
      coach: {
        id: deletedCoach._id,
        name: deletedCoach.name,
        email: deletedCoach.email,
      },
    });
  } catch (error) {
    console.error("Delete coach error:", error);
    return NextResponse.json(
      { message: "Failed to delete coach", error: error.message },
      { status: 500 }
    );
  }
}
