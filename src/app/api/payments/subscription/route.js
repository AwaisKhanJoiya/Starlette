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

      // if (paymentResult.success) {
      //   // Update payment record
      //   payment.status = "completed";
      //   payment.tranzilaTransactionId = paymentResult.transactionId;
      //   payment.tranzilaConfirmationCode = paymentResult.confirmationCode;
      //   payment.tranzilaResponse = paymentResult.rawResponse;
      //   await payment.save();

      //   // Calculate dates
      //   const startDate = new Date();
      //   const nextBillingDate = new Date();
      //   nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      //   const minimumCommitmentEndDate = new Date();
      //   minimumCommitmentEndDate.setMonth(
      //     minimumCommitmentEndDate.getMonth() + 3
      //   );

      //   // Create subscription
      //   const subscription = new Subscription({
      //     userId,
      //     planName,
      //     amount,
      //     classesPerWeek,
      //     classesPerMonth,
      //     tranzilaSubscriptionId: paymentResult.subscriptionToken,
      //     startDate,
      //     nextBillingDate,
      //     minimumCommitmentEndDate,
      //     status: "active",
      //   });
      //   await subscription.save();

      //   // Update payment with subscription reference
      //   payment.subscriptionId = subscription._id;
      //   await payment.save();

      //   return NextResponse.json({
      //     success: true,
      //     message: "Subscription created successfully",
      //     subscription: {
      //       id: subscription._id,
      //       planName: subscription.planName,
      //       classesPerWeek: subscription.classesPerWeek,
      //       classesPerMonth: subscription.classesPerMonth,
      //       amount: subscription.amount,
      //       startDate: subscription.startDate,
      //       nextBillingDate: subscription.nextBillingDate,
      //       minimumCommitmentEndDate: subscription.minimumCommitmentEndDate,
      //     },
      //     payment: {
      //       transactionId: paymentResult.transactionId,
      //       confirmationCode: paymentResult.confirmationCode,
      //       amount: payment.amount,
      //     },
      //   });
      // } else {
      //   // Payment failed
      //   payment.status = "failed";
      //   payment.tranzilaResponse = paymentResult.rawResponse;
      //   await payment.save();

      //   return NextResponse.json(
      //     {
      //       success: false,
      //       message:
      //         paymentResult.responseMessage || "Subscription setup failed",
      //       errorCode: paymentResult.responseCode,
      //     },
      //     { status: 400 }
      //   );
      // }
    } catch (error) {
      // Update payment status to failed
      // payment.status = "failed";
      // payment.metadata = {
      //   ...payment.metadata,
      //   error: error.message,
      // };
      // await payment.save();

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
