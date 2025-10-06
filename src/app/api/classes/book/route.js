import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import User from "@/models/User";
import jwt from "jsonwebtoken";

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

    // Get class ID from request body
    const { classId } = await request.json();
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

    // Find the class
    const classToBook = await Class.findById(classId);
    if (!classToBook) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Check if the class date is in the past
    if (new Date(classToBook.startDate) < new Date()) {
      return NextResponse.json(
        { message: "Cannot book a class that has already started" },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = classToBook.enrolledStudents.find(
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

    // Use the class model's enrollment method
    const enrollmentResult = classToBook.enrollStudent(userId);
    await classToBook.save();

    return NextResponse.json({
      message: enrollmentResult.message,
      status: enrollmentResult.success
        ? enrollmentResult.message.includes("waitlist")
          ? "waitlisted"
          : "confirmed"
        : "error",
    });
  } catch (error) {
    console.error("Book class error:", error);
    return NextResponse.json(
      { message: "Failed to book class", error: error.message },
      { status: 500 }
    );
  }
}
