import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/admin";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";

// GET a specific class
export async function GET(request, { params: pParams }) {
  try {
    // Connect to DB
    await dbConnect();
    const params = await pParams;

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = params.id;
    const foundClass = await Class.findById(classId).populate(
      "coach",
      "name email"
    );

    if (!foundClass) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(foundClass);
  } catch (error) {
    console.error("Get class error:", error);
    return NextResponse.json(
      { message: "Failed to fetch class", error: error.message },
      { status: 500 }
    );
  }
}

// PUT update a class
export async function PUT(request, { params: pParams }) {
  try {
    // Connect to DB
    await dbConnect();
    const params = await pParams;
    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = params.id;
    const body = await request.json();

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Update class error:", error);
    return NextResponse.json(
      {
        message: "Failed to update class",
        error: error.message,
        details: error.errors,
      },
      { status: 500 }
    );
  }
}

// DELETE a class
export async function DELETE(request, { params: pParams }) {
  try {
    // Connect to DB
    await dbConnect();
    const params = await pParams;
    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = params.id;
    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete class error:", error);
    return NextResponse.json(
      { message: "Failed to delete class", error: error.message },
      { status: 500 }
    );
  }
}
