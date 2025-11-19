import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import ClassPack from "@/models/ClassPack";
import User from "@/models/User";
import tranzilaService from "@/services/takbullService";
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
    const userId = auth.user._id;

    const body = await request.json();

    const { id } = body;
    const pricingDetails = PRICES.find((plan) => plan.id === id);
    if (!pricingDetails) {
      return NextResponse.json(
        { message: "Invalid subscription plan selected" },
        { status: 400 }
      );
    }

    const classPack = new ClassPack({
      userId,
      planId: pricingDetails.id,
      totalClasses: pricingDetails.classes,
      remainingClasses: pricingDetails.classes,
      amount: pricingDetails.price,
      validUntil: new Date(
        Date.now() + pricingDetails.validForMonths * 30 * 24 * 60 * 60 * 1000
      ),
      status: "pending",
    });
    await classPack.save();

    try {
      // Process payment through Tranzila
      const paymentResult = await tranzilaService.processOneTimePayment({
        amount: pricingDetails.price,
        order_reference: classPack._id.toString(),
      });

      if (paymentResult.responseCode !== 0) {
        await ClassPack.findByIdAndDelete(classPack._id);
      }

      return NextResponse.json(paymentResult, { status: 200 });
    } catch (error) {
      // Update payment status to failed
      await ClassPack.findByIdAndDelete(classPack._id);

      throw error;
    }
  } catch (error) {
    console.error("Class pack purchase error:", error);
    return NextResponse.json(
      {
        message: "Failed to process purchase",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
