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
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit")) || 50;

    // Validate date
    if (!date) {
      return NextResponse.json(
        { message: "date parameter is required" },
        { status: 400 }
      );
    }

    const requestedDate = new Date(date);
    // Normalize to start of day
    requestedDate.setHours(0, 0, 0, 0);

    // Get the day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = requestedDate.getDay();

    // Create start and end dates for the requested day (midnight to midnight)
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Build query for one-time classes occurring on this exact date
    const onetimeQuery = {
      recurrenceType: "onetime",
      startDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      isActive: true,
    };
    // Build query for recurring classes
    const recurringQuery = {
      $and: [
        { recurrenceType: { $ne: "onetime" } }, // Not one-time events
        // Include the case when the class starts on the same day
        {
          startDate: {
            // Convert to date strings for comparison to handle timezone issues
            $lte: new Date(endOfDay.toISOString()),
          },
        },
        {
          $or: [
            { recurrenceEndDate: { $gte: startOfDay } }, // End date is after requested date
            { recurrenceEndDate: null }, // No end date specified
          ],
        },
        { isActive: true },
      ],
    };

    // For weekly recurrence, also check if the day of week matches
    const weeklyQuery = {
      ...recurringQuery,
      recurrenceType: "weekly",
      daysOfWeek: dayOfWeek,
    };

    // For daily recurrence, no additional filters needed
    const dailyQuery = {
      ...recurringQuery,
      recurrenceType: "daily",
    };

    // For monthly recurrence, we'll handle this separately since we need to check day of month
    const monthlyQuery = {
      ...recurringQuery,
      recurrenceType: "monthly",
    };

    // Combine queries for non-monthly classes
    const query = {
      $or: [onetimeQuery, weeklyQuery, dailyQuery],
    };

    // Get all potential classes
    const allClasses = await Class.find({
      $or: [query, monthlyQuery],
    })
      .sort({ startTime: 1 })
      .limit(limit)
      .populate("coach", "name")
      .lean();

    // Filter classes based on their recurrence type and the requested date
    const classes = allClasses.filter((classItem) => {
      const classStartDate = new Date(classItem.startDate);

      // Handle special case: if this is exactly the start date of the recurring class
      // we should always include it (first occurrence)
      const isFirstOccurrence =
        classStartDate.toISOString().split("T")[0] === date;

      if (isFirstOccurrence) {
        return true;
      }

      // For non-monthly recurring classes that aren't on their first occurrence,
      // we've already filtered them correctly in the query
      if (classItem.recurrenceType !== "monthly") {
        return true;
      }

      // For monthly classes, check if day of month matches
      const classStartDay = classStartDate.getDate();
      const requestedDay = requestedDate.getDate();

      return classStartDay === requestedDay;
    });

    // Helper function to create a formatted recurring instance
    function createRecurringInstance(classItem, requestedDateStr) {
      const originalDate = new Date(classItem.startDate);
      const requestedDate = new Date(requestedDateStr);

      // Create a virtual date for this instance that maintains the same time
      const virtualDate = new Date(requestedDate);
      virtualDate.setHours(originalDate.getHours());
      virtualDate.setMinutes(originalDate.getMinutes());
      virtualDate.setSeconds(originalDate.getSeconds());

      return virtualDate;
    }

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

      // For recurring classes, adjust the date while keeping the same time
      const isRecurring =
        classItem.recurrenceType && classItem.recurrenceType !== "onetime";

      // Use actual date for one-time classes, but requested date for recurring classes
      const classStartDate = new Date(classItem.startDate);
      const displayDate = isRecurring
        ? date // Use the requested date for recurring classes
        : classStartDate.toISOString().split("T")[0];

      // Double-check that one-time classes are actually on the requested date
      if (!isRecurring) {
        const classDateStr = classStartDate.toISOString().split("T")[0];
        // Skip this class if it's not on the requested date (extra safety check)
        if (classDateStr !== date) {
          console.warn(
            `Skipping one-time class ${classItem._id} with date ${classDateStr} not matching requested date ${date}`
          );
          return null;
        }
      }

      // Create a unique ID for recurring instances
      const instanceId = isRecurring
        ? `${classItem._id.toString()}-${date}`
        : classItem._id.toString();

      // Calculate virtual start time for recurring instances
      const virtualStartTime = isRecurring
        ? createRecurringInstance(classItem, date)
        : new Date(classItem.startDate);

      return {
        id: instanceId,
        time: classItem.startTime,
        duration: `${durationMinutes} min`,
        type: classItem.classType?.toUpperCase() || "CLASS",
        instructor: classItem.coach?.name || "Instructor",
        status: status,
        capacity: `${confirmedStudents}/${capacity}`,
        date: displayDate,
        virtualDate: virtualStartTime, // Include the calculated date with correct time
        location: classItem.location || "Studio",
        waitlistEnabled: classItem.waitlistEnabled || false,
        languages: classItem.languages || ["English"],
        description: classItem.description || "",
        title: classItem.title,
        recurrenceType: classItem.recurrenceType || "onetime",
        isRecurringInstance: isRecurring,
        originalClassId: classItem._id.toString(), // Store the original class ID for booking
      };
    });

    // Filter out any null values from our safety check
    const filteredClasses = formattedClasses.filter(Boolean);

    return NextResponse.json({
      classes: filteredClasses,
      requestedDate: date,
    });
  } catch (error) {
    console.error("Get public classes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch classes", error: error.message },
      { status: 500 }
    );
  }
}
