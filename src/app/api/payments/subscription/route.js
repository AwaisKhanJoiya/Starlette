import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import takbullService from "@/services/takbullService";
import jwt from "jsonwebtoken";
import { authMiddleware } from "@/middleware/auth";
import { PRICES } from "@/lib/pricing";

export async function POST(request) {
  try {
    await dbConnect();

    // Verify user authentication

    const auth = await authMiddleware(request);

    if (!auth.success) {
      return auth.response;
    }

    const body = await request.json();
    const { id } = body;
    const pricingDetails = PRICES.find((plan) => plan.id === id);
    if (!pricingDetails) {
      return NextResponse.json(
        { message: "Invalid subscription plan selected" },
        { status: 400 }
      );
    }
    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId: auth.user._id,
      status: "active",
    });

    if (existingSubscription) {
      return NextResponse.json(
        {
          message:
            "You already have an active subscription. Please cancel it first before subscribing to a new plan.",
          subscription: existingSubscription,
        },
        { status: 400 }
      );
    }

    const subscription = new Subscription({
      userId: auth.user._id,
      planId: pricingDetails.id,
      amount: pricingDetails.price,
      classesPerWeek: pricingDetails.classes,
      classesPerMonth: pricingDetails.classes * 4,
      status: "pending",
    });
    await subscription.save();

    try {
      // Process recurring payment through Takbull
      const paymentResult = await takbullService.setupRecurringPayment({
        amount: pricingDetails.price,
        order_reference: subscription._id.toString(),
      });
      return NextResponse.json(paymentResult, { status: 200 });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      {
        message: "Failed to create subscription",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
