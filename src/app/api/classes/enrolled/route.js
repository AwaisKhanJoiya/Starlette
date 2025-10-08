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
    const userId = decodedToken.id;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get("includeHistory") === "true";
    const now = new Date();

    // Base query to find classes where the user is enrolled
    const query = {
      "enrolledStudents.studentId": userId,
    };

    // If not including history, only get upcoming classes
    if (!includeHistory) {
      // For one-time classes, check the startDate
      // For recurring classes with instanceDate, check the instanceDate
      query["$or"] = [
        {
          recurrenceType: "onetime",
          startDate: { $gte: now },
        },
        {
          "enrolledStudents.instanceDate": { $gte: now },
        },
      ];
    }

    // Find classes where the user is enrolled
    const classes = await Class.find(query)
      .sort({ startDate: 1, startTime: 1 })
      .populate("coach", "name")
      .lean();
    // Format the classes for the response
    const enrolledClasses = [];

    // Process each class and create entries for each of the user's enrollments
    classes.forEach((classItem) => {
      // Find all enrollments for this user in this class
      const userEnrollments = classItem.enrolledStudents.filter(
        (student) => student.studentId.toString() === userId
      );

      // For each enrollment, create a class instance in the response
      userEnrollments.forEach((enrollment) => {
        // Calculate class status based on enrolledStudents
        const confirmedStudents = (classItem.enrolledStudents || []).filter(
          (student) => student.status === "confirmed"
        ).length;

        const capacity = classItem.capacity || 5;
        const spotsLeft = capacity - confirmedStudents;

        let classStatus = "available";
        if (spotsLeft <= 0) {
          classStatus = "full";
        }

        // Format class duration - use fixed 50 minutes
        const durationMinutes = 50;

        // Determine the correct date to display
        let displayDate;
        let isPast;

        // For recurring classes with instance data
        if (enrollment.instanceDate) {
          displayDate = new Date(enrollment.instanceDate);
          isPast = displayDate < new Date();
        }
        // For one-time classes
        else {
          displayDate = new Date(classItem.startDate);
          isPast = displayDate < new Date();
        }

        enrolledClasses.push({
          id: enrollment.instanceId || classItem._id.toString(),
          time: classItem.startTime,
          duration: `${durationMinutes} min`,
          type: classItem.classType?.toUpperCase() || "CLASS",
          instructor: classItem.coach?.name || "Instructor",
          status: classStatus,
          capacity: `${confirmedStudents}/${capacity}`,
          date: displayDate.toISOString().split("T")[0],
          location: classItem.location || "Studio",
          waitlistEnabled: classItem.waitlistEnabled || false,
          languages: classItem.languages || ["Hebrew"],
          description: classItem.description || "",
          title: classItem.title,
          enrollmentStatus: enrollment.status || "confirmed",
          isPast,
          canCancel: !isPast && enrollment.status !== "cancelled",
          instanceId: enrollment.instanceId,
        });
      });
    });

    // Sort by date and time
    enrolledClasses.sort((a, b) => {
      // First by date
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;

      // Then by time if on the same date
      return a.time.localeCompare(b.time);
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
