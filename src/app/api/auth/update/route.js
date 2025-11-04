import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { authMiddleware } from "@/middleware/auth";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    // Verify authentication
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();

    // Fields that can be updated
    const updateFields = {};
    if (data.name) updateFields.name = data.name;
    if (data.phoneNumber) updateFields.phoneNumber = data.phoneNumber;
    if (data.dateOfBirth) updateFields.dateOfBirth = data.dateOfBirth;
    console.log(updateFields);
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user?.user?._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
