import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";

// GET classes for the booking calendar (public endpoint)
export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit")) || 50;

    // Validate dates
    if (!startDate) {
      return NextResponse.json(
        { message: "startDate parameter is required" },
        { status: 400 }
      );
    }

    // Build query
    const query = {
      startDate: { $gte: new Date(startDate) },
      isActive: true, // Only show active classes
    };

    if (endDate) {
      query.startDate.$lte = new Date(endDate);
    }

    // Get classes
    const classes = await Class.find(query)
      .sort({ startDate: 1, startTime: 1 })
      .limit(limit)
      .populate("coach", "name")
      .lean();

    // Transform class data to the format expected by the calendar
    const formattedClasses = classes.map((classItem) => {
      // Calculate class status based on enrolledStudents
      const confirmedStudents = (classItem.enrolledStudents || []).filter(
        (student) => student.status === "confirmed"
      ).length;

      const capacity = classItem.capacity || 10;
      const spotsLeft = capacity - confirmedStudents;

      let status = "available";
      if (spotsLeft <= 0) {
        status = "full";
      }

      // Format class duration
      const startTime = new Date(`2000-01-01T${classItem.startTime}`);
      const endTime = new Date(`2000-01-01T${classItem.endTime}`);
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

      return {
        id: classItem._id.toString(),
        time: classItem.startTime,
        duration: `${durationMinutes} min`,
        type: classItem.classType?.toUpperCase() || "CLASS",
        instructor: classItem.coach?.name || "Instructor",
        status: status,
        capacity: `${confirmedStudents}/${capacity}`,
        date: new Date(classItem.startDate).toISOString().split("T")[0],
        location: classItem.location || "Studio",
        waitlistEnabled: classItem.waitlistEnabled || false,
        languages: classItem.languages || ["English"],
        description: classItem.description || "",
        title: classItem.title,
      };
    });

    return NextResponse.json({
      classes: formattedClasses,
    });
  } catch (error) {
    console.error("Get public classes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch classes", error: error.message },
      { status: 500 }
    );
  }
}
