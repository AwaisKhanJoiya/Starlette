import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import jwt from "jsonwebtoken";
import {
  processCancellation,
  getCancellationDeadline,
} from "@/services/bookingService";

// POST endpoint for cancelling a class booking
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

    // Get class ID from request body
    const { classId } = await request.json();
    if (!classId) {
      return NextResponse.json(
        { message: "Class ID is required" },
        { status: 400 }
      );
    }

    // Get user ID from token
    const userId = decodedToken.userId;

    // Find the class
    const classToCancel = await Class.findOne({
      "enrolledStudents.instanceId": classId,
    });
    if (!classToCancel) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Find the student's enrollment
    const studentEnrollmentIndex = classToCancel.enrolledStudents.findIndex(
      (student) => student.instanceId.toString() === classId
    );

    if (studentEnrollmentIndex === -1) {
      return NextResponse.json(
        { message: "You are not enrolled in this class" },
        { status: 400 }
      );
    }

    // Get the enrollment record
    const enrollment = classToCancel.enrolledStudents[studentEnrollmentIndex];

    // Check if already cancelled
    if (enrollment.status === "cancelled") {
      return NextResponse.json(
        { message: "Enrollment is already cancelled" },
        { status: 400 }
      );
    }

    // Get the cancellation deadline based on user's membership type
    const cancellationPolicy = await getCancellationDeadline(userId);
    const requiredHours = cancellationPolicy.requiredHours;

    // Check if the class is starting within the cancellation deadline
    // Get date from enrollment.instanceDate and time from classToCancel.startTime
    const classDateStr = enrollment.instanceDate
      ? new Date(enrollment.instanceDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const classTimeStr = classToCancel.startTime;

    // Combine date and time into a single datetime
    const [hours, minutes] = classTimeStr.split(":").map(Number);
    const classDateTime = new Date(classDateStr);
    classDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const hoursDifference = (classDateTime - now) / (1000 * 60 * 60);

    if (hoursDifference < requiredHours) {
      const membershipMessage = cancellationPolicy.hasSubscription
        ? "Subscribed members must cancel at least 12 hours before the class"
        : "Members must cancel at least 24 hours before the class";

      return NextResponse.json(
        {
          message: `Cannot cancel: ${membershipMessage}. You have ${hoursDifference.toFixed(
            1
          )} hours remaining.`,
          requiredHours,
          remainingHours: hoursDifference,
          membershipType: cancellationPolicy.membershipType,
        },
        { status: 400 }
      );
    }

    // Update the enrollment status to cancelled
    enrollment.status = "cancelled";
    await classToCancel.save();

    // Process cancellation (refund ClassPack if applicable)
    const cancellationResult = await processCancellation(userId, classId);

    // If a spot opened up and there are waitlisted students, move the first waitlisted student to confirmed
    if (enrollment.status === "confirmed") {
      const waitlistedStudents = classToCancel.enrolledStudents.filter(
        (student) => student.status === "waitlisted"
      );

      if (waitlistedStudents.length > 0) {
        // Move the first waitlisted student to confirmed
        const firstWaitlisted = waitlistedStudents[0];
        const waitlistedIndex = classToCancel.enrolledStudents.findIndex(
          (student) =>
            student.studentId.toString() ===
            firstWaitlisted.studentId.toString()
        );

        if (waitlistedIndex !== -1) {
          classToCancel.enrolledStudents[waitlistedIndex].status = "confirmed";
          await classToCancel.save();
        }
      }
    }

    return NextResponse.json({
      message: "Class booking cancelled successfully",
      cancellationDetails: cancellationResult,
    });
  } catch (error) {
    console.error("Cancel class error:", error);
    return NextResponse.json(
      { message: "Failed to cancel class booking", error: error.message },
      { status: 500 }
    );
  }
}
