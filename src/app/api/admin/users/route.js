import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import ClassPack from "@/models/ClassPack";
import Class from "@/models/Class";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Verify admin authentication
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

    // Verify admin role
    if (decodedToken.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Fetch all users (excluding password)
    const users = await User.find({}).select("-password").lean();

    // Fetch all subscriptions, class packs, and classes in parallel
    const [subscriptions, classPacks, classes] = await Promise.all([
      Subscription.find({}).lean(),
      ClassPack.find({}).lean(),
      Class.find({}).lean(),
    ]);

    // Create maps for quick lookup
    const subscriptionsByUser = {};
    const classPacksByUser = {};

    subscriptions.forEach((sub) => {
      const userId = sub.userId.toString();
      if (!subscriptionsByUser[userId]) {
        subscriptionsByUser[userId] = [];
      }
      subscriptionsByUser[userId].push(sub);
    });

    classPacks.forEach((pack) => {
      const userId = pack.userId.toString();
      if (!classPacksByUser[userId]) {
        classPacksByUser[userId] = [];
      }
      classPacksByUser[userId].push(pack);
    });

    // Build user data with plans and booking history
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const userId = user._id.toString();

        // Get active subscription
        const userSubscriptions = subscriptionsByUser[userId] || [];
        const activeSubscription = userSubscriptions.find(
          (sub) => sub.status === "active"
        );

        // Get active class packs
        const userClassPacks = classPacksByUser[userId] || [];
        const activeClassPacks = userClassPacks.filter(
          (pack) =>
            pack.status === "active" &&
            pack.remainingClasses > 0 &&
            new Date(pack.validUntil) >= new Date()
        );

        // Calculate total available classes
        let availableClasses = 0;
        let classPackClasses = 0;
        let subscriptionClasses = "Unlimited";
        let weeklyLimit = null;

        // Count class pack classes
        activeClassPacks.forEach((pack) => {
          classPackClasses += pack.remainingClasses;
        });
        availableClasses += classPackClasses;

        // Add subscription info
        if (activeSubscription) {
          weeklyLimit = activeSubscription.classesPerWeek;
          subscriptionClasses = `${activeSubscription.classesPerWeek}/week`;
        }

        // Get booking history
        const bookingHistory = [];
        classes.forEach((classItem) => {
          classItem.enrolledStudents?.forEach((enrollment) => {
            if (enrollment.studentId.toString() === userId) {
              bookingHistory.push({
                classId: classItem._id,
                classTitle: classItem.title,
                classType: classItem.classType,
                date: enrollment.instanceDate || classItem.startDate,
                time: classItem.startTime,
                status: enrollment.status,
                enrolledAt: enrollment.enrollmentDate,
                coach: classItem.coach,
              });
            }
          });
        });

        // Sort booking history by date (most recent first)
        bookingHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          createdAt: user.createdAt,
          role: user.role,
          currentPlan: {
            subscription: activeSubscription
              ? {
                  planId: activeSubscription.planId,
                  status: activeSubscription.status,
                  classesPerWeek: activeSubscription.classesPerWeek,
                  classesPerMonth: activeSubscription.classesPerMonth,
                  amount: activeSubscription.amount,
                  startDate: activeSubscription.startDate,
                  nextBillingDate: activeSubscription.nextBillingDate,
                }
              : null,
            classPacks: activeClassPacks.map((pack) => ({
              planId: pack.planId,
              totalClasses: pack.totalClasses,
              remainingClasses: pack.remainingClasses,
              validUntil: pack.validUntil,
              purchaseDate: pack.purchaseDate,
            })),
          },
          availableClasses: {
            total: availableClasses,
            fromClassPacks: classPackClasses,
            fromSubscription: subscriptionClasses,
            weeklyLimit: weeklyLimit,
          },
          bookingHistory: {
            total: bookingHistory.length,
            upcoming: bookingHistory.filter(
              (b) => new Date(b.date) >= new Date() && b.status === "confirmed"
            ).length,
            past: bookingHistory.filter((b) => new Date(b.date) < new Date())
              .length,
            cancelled: bookingHistory.filter((b) => b.status === "cancelled")
              .length,
            recentBookings: bookingHistory.slice(0, 5), // Last 5 bookings
          },
          totalSubscriptions: userSubscriptions.length,
          totalClassPacks: userClassPacks.length,
        };
      })
    );

    return NextResponse.json({
      users: usersWithDetails,
      total: usersWithDetails.length,
      stats: {
        totalUsers: usersWithDetails.length,
        activeSubscriptions: usersWithDetails.filter(
          (u) => u.currentPlan.subscription !== null
        ).length,
        activeClassPacks: usersWithDetails.filter(
          (u) => u.currentPlan.classPacks.length > 0
        ).length,
        totalBookings: usersWithDetails.reduce(
          (sum, u) => sum + u.bookingHistory.total,
          0
        ),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
