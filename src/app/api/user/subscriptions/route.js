import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();

    // Verify user authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

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

    const userId = decodedToken.id;

    // Get user's subscriptions
    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      subscriptions,
      activeSubscription:
        subscriptions.find((sub) => sub.status === "active") || null,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscriptions", error: error.message },
      { status: 500 }
    );
  }
}
