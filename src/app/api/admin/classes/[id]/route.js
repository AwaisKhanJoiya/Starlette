import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/admin";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import User from "@/models/User";

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
    const foundClass = await Class.findById(classId)
      .populate("coach", "name email")
      .lean();

    if (!foundClass) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Populate enrolled students with their full user data
    if (foundClass.enrolledStudents && foundClass.enrolledStudents.length > 0) {
      const studentIds = foundClass.enrolledStudents.map((s) => s.studentId);
      const users = await User.find({ _id: { $in: studentIds } })
        .select("name email phoneNumber")
        .lean();

      // Create a map of user data by ID
      const userMap = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user;
      });

      // Merge user data with enrollment data
      foundClass.enrolledStudents = foundClass.enrolledStudents.map(
        (enrollment) => {
          const userId = enrollment.studentId.toString();
          const user = userMap[userId] || {};
          return {
            ...enrollment,
            name: user.name || "Unknown",
            email: user.email || "N/A",
            phone: user.phoneNumber || "N/A",
            userId: userId,
          };
        }
      );
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
    const classData = await request.json();

    // If end time is not provided, calculate it based on start time + 50 minutes
    if (!classData.endTime && classData.startTime) {
      const [hours, minutes] = classData.startTime.split(":").map(Number);
      const startDate = new Date(2000, 0, 1, hours, minutes);
      const endDate = new Date(startDate.getTime() + 50 * 60000); // Add 50 minutes

      // Format as HH:MM
      const endHours = endDate.getHours().toString().padStart(2, "0");
      const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
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

    // Set duration to 50 minutes
    classData.duration = 50;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $set: classData },
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
