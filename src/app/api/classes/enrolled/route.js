import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import jwt from "jsonwebtoken";

// GET endpoint for fetching user's enrolled classes
export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user ID from token
    const userId = decodedToken.userId;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get("includeHistory") === "true";
    
    // Base query to find classes where the user is enrolled
    const query = {
      "enrolledStudents.studentId": userId,
    };
    
    // If not including history, only get upcoming classes
    if (!includeHistory) {
      query.startDate = { $gte: new Date() };
    }

    // Find classes where the user is enrolled
    const classes = await Class.find(query)
      .sort({ startDate: 1, startTime: 1 })
      .populate("coach", "name")
      .lean();

    // Format the classes for the response
    const enrolledClasses = classes.map(classItem => {
      // Find the user's enrollment status
      const userEnrollment = classItem.enrolledStudents.find(
        student => student.studentId.toString() === userId
      );

      // Calculate class status based on enrolledStudents
      const confirmedStudents = (classItem.enrolledStudents || []).filter(
        student => student.status === "confirmed"
      ).length;

      const capacity = classItem.capacity || 10;
      const spotsLeft = capacity - confirmedStudents;

      let classStatus = "available";
      if (spotsLeft <= 0) {
        classStatus = "full";
      }

      // Format class duration
      const startTime = new Date(`2000-01-01T${classItem.startTime}`);
      const endTime = new Date(`2000-01-01T${classItem.endTime}`);
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

      // Check if class is in the past
      const isPast = new Date(classItem.startDate) < new Date();

      return {
        id: classItem._id.toString(),
        time: classItem.startTime,
        duration: `${durationMinutes} min`,
        type: classItem.classType?.toUpperCase() || "CLASS",
        instructor: classItem.coach?.name || "Instructor",
        status: classStatus,
        capacity: `${confirmedStudents}/${capacity}`,
        date: new Date(classItem.startDate).toISOString().split("T")[0],
        location: classItem.location || "Studio",
        waitlistEnabled: classItem.waitlistEnabled || false,
        languages: classItem.languages || ["English"],
        description: classItem.description || "",
        title: classItem.title,
        enrollmentStatus: userEnrollment?.status || "confirmed",
        isPast,
        canCancel: !isPast && userEnrollment?.status !== "cancelled"
      };
    });

    return NextResponse.json({
      classes: enrolledClasses,
    });
  } catch (error) {
    console.error("Get enrolled classes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch enrolled classes", error: error.message },
      { status: 500 }
    );
  }
}