import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// In a real application, you would have a database of admin users
// and proper password hashing and authentication
const ADMIN_USERS = [
  {
    email: "admin@starlette.com",
    password: "admin123", // In production, this would be hashed
    name: "Admin User",
  },
];

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = ADMIN_USERS.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session token (in a real app, use JWT or similar)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    // Set cookie with token
    cookies().set("admin-token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
