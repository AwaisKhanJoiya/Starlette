import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Get the token from cookies
    const cookie = await cookies();
    const token = cookie.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // In a real app, you would validate the token here
    // For example, verify a JWT or check the token in a database

    // For this example, we'll just check if the token exists
    return NextResponse.json({
      message: "Authenticated",
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { message: "An error occurred during authentication check" },
      { status: 500 }
    );
  }
}
