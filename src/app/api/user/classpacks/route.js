import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ClassPack from "@/models/ClassPack";
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

    // Get query parameter for status filter
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    // Build query
    const query = { userId };
    if (statusFilter) {
      query.status = statusFilter;
    }

    // Get user's class packs
    const classPacks = await ClassPack.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Find active class pack with remaining classes
    const activeClassPack =
      classPacks.find(
        (pack) => pack.status === "active" && pack.remainingClasses > 0
      ) || null;

    return NextResponse.json({
      classPacks,
      activeClassPack,
      totalPacks: classPacks.length,
    });
  } catch (error) {
    console.error("Get class packs error:", error);
    return NextResponse.json(
      { message: "Failed to fetch class packs", error: error.message },
      { status: 500 }
    );
  }
}
