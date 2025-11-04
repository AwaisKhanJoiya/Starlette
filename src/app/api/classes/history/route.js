import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import jwt from "jsonwebtoken";

// GET endpoint for fetching user's past enrolled classes
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
    const userId = decodedToken.id;

    const now = new Date();

    // Find classes where the user is enrolled and the class date has passed
    const classes = await Class.find({
      "enrolledStudents.studentId": userId,
    })
      .populate("coach", "name")
      .lean();

    // Format the classes for the response
    const pastClasses = [];

    // Process each class and create entries for past enrollments
    classes.forEach((classItem) => {
      // Find all enrollments for this user in this class
      const userEnrollments = classItem.enrolledStudents.filter(
        (student) =>
          student.studentId.toString() === userId &&
          student.status !== "cancelled"
      );

      // For each enrollment, check if it's in the past and create an entry
      userEnrollments.forEach((enrollment) => {
        let displayDate;
        let isPast = false;

        // For recurring classes with instance data
        if (enrollment.instanceDate) {
          displayDate = new Date(enrollment.instanceDate);
          isPast = displayDate < now;
        } else {
          // For one-time classes
          displayDate = new Date(classItem.startDate);
          isPast = displayDate < now;
        }

        // Only include past classes
        if (!isPast) return;

        // Create a complete datetime by combining date and time
        const classDateTime = new Date(displayDate);
        const [hours, minutes] = classItem.startTime.split(":").map(Number);
        classDateTime.setHours(hours, minutes, 0, 0);

        // Determine if the user attended or missed the class
        // For now, we'll mark all as "present" unless there's an attendance field
        const status = enrollment.attendance || "present";

        // Format date as DD/MM/YYYY
        const formattedDate = displayDate.toLocaleDateString("en-GB");

        pastClasses.push({
          id: enrollment.instanceId || classItem._id.toString(),
          date: formattedDate,
          time: classItem.startTime,
          classType: classItem.classType?.toUpperCase() || "CLASS",
          instructor: classItem.coach?.name || "Instructor",
          status: status,
          enrollmentStatus: enrollment.status,
          rawDate: displayDate,
        });
      });
    });

    // Sort by date (most recent first)
    pastClasses.sort((a, b) => b.rawDate - a.rawDate);

    // Remove rawDate before sending response
    const formattedClasses = pastClasses.map(({ rawDate, ...rest }) => rest);

    return NextResponse.json({
      classes: formattedClasses,
      count: formattedClasses.length,
    });
  } catch (error) {
    console.error("Get class history error:", error);
    return NextResponse.json(
      { message: "Failed to fetch class history", error: error.message },
      { status: 500 }
    );
  }
}
