import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { validateUserCanBook, processBooking } from "@/services/bookingService";

// POST endpoint for booking a class
export async function POST(request) {
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

    // Get data from request body
    const { classId, date, instanceId } = await request.json();
    if (!classId) {
      return NextResponse.json(
        { message: "Class ID is required" },
        { status: 400 }
      );
    }

    // Get user ID from token
    const userId = decodedToken.id;

    // Find the user to verify they exist
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // VALIDATION: Check if user has valid subscription or ClassPack
    const bookingValidation = await validateUserCanBook(userId);

    if (!bookingValidation.canBook) {
      return NextResponse.json(
        {
          message: bookingValidation.message,
          details: bookingValidation.details,
        },
        { status: 403 }
      );
    }

    // Find the class by original ID
    const classToBook = await Class.findById(classId);
    if (!classToBook) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    let effectiveDate = classToBook.startDate;

    // For recurring classes, we need to handle the specific instance date
    if (
      classToBook.recurrenceType &&
      classToBook.recurrenceType !== "onetime" &&
      date
    ) {
      // Use the provided date for the recurring instance
      effectiveDate = new Date(date);

      // If the recurring class hasn't started yet according to its schedule,
      // or has already ended, reject the booking
      const originalStartDate = new Date(classToBook.startDate);
      const recurrenceEndDate = classToBook.recurrenceEndDate
        ? new Date(classToBook.recurrenceEndDate)
        : null;

      if (
        originalStartDate > effectiveDate ||
        (recurrenceEndDate && recurrenceEndDate < effectiveDate)
      ) {
        return NextResponse.json(
          {
            message:
              "Cannot book this recurring class instance - out of valid date range",
          },
          { status: 400 }
        );
      }
    }

    // Check if the class date is in the past
    if (new Date(effectiveDate) < new Date()) {
      return NextResponse.json(
        { message: "Cannot book a class that has already started" },
        { status: 400 }
      );
    }

    // For recurring classes, we should also store the instance ID in the enrollment
    // so we can track which specific instance was booked
    const bookingMetadata =
      instanceId && instanceId !== classId ? { instanceId, date } : {};

    // For recurring classes, check if this specific instance is full
    if (instanceId && instanceId !== classId) {
      // Count confirmed students for this specific instance
      const confirmedStudentsForInstance = classToBook.enrolledStudents.filter(
        (student) =>
          student.status === "confirmed" && student.instanceId === instanceId
      ).length;

      // Check if this specific instance is at capacity
      if (confirmedStudentsForInstance >= classToBook.capacity) {
        // If waitlist is not enabled, reject the booking
        if (!classToBook.waitlistEnabled) {
          return NextResponse.json(
            { message: "This class is full for the selected date" },
            { status: 400 }
          );
        }
      }
    } else {
      // For one-time classes, check if the class is full
      const confirmedStudents = classToBook.enrolledStudents.filter(
        (student) => student.status === "confirmed"
      ).length;

      // Check if at capacity and waitlist is disabled
      if (
        confirmedStudents >= classToBook.capacity &&
        !classToBook.waitlistEnabled
      ) {
        return NextResponse.json(
          { message: "This class is full and waitlist is not enabled" },
          { status: 400 }
        );
      }
    }

    // Check if user is already enrolled
    const existingEnrollment = instanceId
      ? classToBook.enrolledStudents.find(
          (student) =>
            student.studentId.toString() === userId &&
            student.instanceId === instanceId
        )
      : classToBook.enrolledStudents.find(
          (student) => student.studentId.toString() === userId
        );

    if (existingEnrollment) {
      if (existingEnrollment.status === "cancelled") {
        // If previously cancelled, reactivate the enrollment
        existingEnrollment.status = "confirmed";
        await classToBook.save();
        return NextResponse.json({
          message: "Re-enrolled in class successfully",
          status: "confirmed",
        });
      } else {
        return NextResponse.json(
          {
            message: "Already enrolled in this class",
            status: existingEnrollment.status,
          },
          { status: 400 }
        );
      }
    }

    // Use the class model's enrollment method with metadata for recurring classes
    const enrollmentResult = classToBook.enrollStudent(userId, bookingMetadata);

    // If enrollment failed (class is full and waitlist not enabled)
    if (!enrollmentResult.success) {
      return NextResponse.json(
        {
          message: enrollmentResult.message,
          status: "error",
        },
        { status: 400 }
      );
    }

    // Save changes if successful
    await classToBook.save();

    // Process the booking (deduct from ClassPack if applicable)
    const bookingProcessResult = await processBooking(
      userId,
      classId,
      effectiveDate,
      bookingValidation.bookingMethod,
      bookingValidation.classPack
    );

    // Return appropriate response with instance information for recurring classes
    return NextResponse.json({
      message: enrollmentResult.message,
      status: enrollmentResult.message.includes("waitlist")
        ? "waitlisted"
        : "confirmed",
      bookingMethod: bookingValidation.bookingMethod,
      bookingDetails: bookingProcessResult,
      // Include instance info if this was a recurring class
      instanceId: instanceId || classId,
      date: date || new Date(classToBook.startDate).toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Book class error:", error);
    return NextResponse.json(
      { message: "Failed to book class", error: error.message },
      { status: 500 }
    );
  }
}
