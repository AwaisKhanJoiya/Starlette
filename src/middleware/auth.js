import { NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "@/lib/tokens";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function authMiddleware(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract token from request headers
    const token = extractTokenFromHeader(request);

    if (!token) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 401 }
        ),
      };
    }

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        ),
      };
    }

    // Add user to request context
    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Auth middleware error:", error);

    return {
      success: false,
      response: NextResponse.json(
        { message: "Authentication failed", error: error.message },
        { status: 500 }
      ),
    };
  }
}
