import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import tranzilaService from "@/services/takbullService";
import jwt from "jsonwebtoken";

export async function POST(request) {
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

    const body = await request.json();
    const { subscriptionId, reason } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Find subscription
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId,
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    if (subscription.status !== "active") {
      return NextResponse.json(
        { message: "Subscription is not active" },
        { status: 400 }
      );
    }

    // Check if subscription can be cancelled
    const cancellationCheck = subscription.canBeCancelled();

    if (!cancellationCheck.allowed) {
      return NextResponse.json(
        {
          message: cancellationCheck.reason,
          minimumCommitmentEndDate: subscription.minimumCommitmentEndDate,
        },
        { status: 400 }
      );
    }

    try {
      // Cancel subscription in Tranzila
      const cancelResult = await tranzilaService.cancelRecurringPayment(
        subscription.tranzilaSubscriptionId
      );

      if (cancelResult.success) {
        // Update subscription status
        subscription.status = "cancelled";
        subscription.cancelledAt = new Date();
        subscription.cancellationReason =
          reason || "User requested cancellation";
        subscription.endDate = cancellationCheck.effectiveDate; // 1 month from now
        await subscription.save();

        return NextResponse.json({
          success: true,
          message: "Subscription will be cancelled after 1-month notice period",
          subscription: {
            id: subscription._id,
            status: subscription.status,
            cancelledAt: subscription.cancelledAt,
            endDate: subscription.endDate,
          },
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              cancelResult.responseMessage ||
              "Failed to cancel subscription with payment provider",
            errorCode: cancelResult.responseCode,
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Tranzila cancellation error:", error);
      return NextResponse.json(
        {
          message: "Failed to cancel subscription with payment provider",
          error: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    return NextResponse.json(
      {
        message: "Failed to cancel subscription",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
