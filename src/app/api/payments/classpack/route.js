import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import ClassPack from "@/models/ClassPack";
import User from "@/models/User";
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
    const {
      packName,
      packType,
      totalClasses,
      amount,
      validityMonths,
      cardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      cardHolderName,
      cardHolderId,
    } = body;

    // Validate required fields
    if (!packName || !packType || !totalClasses || !amount || !validityMonths) {
      return NextResponse.json(
        { message: "Missing required pack information" },
        { status: 400 }
      );
    }

    if (
      !cardNumber ||
      !cvv ||
      !expiryMonth ||
      !expiryYear ||
      !cardHolderName ||
      !cardHolderId
    ) {
      return NextResponse.json(
        { message: "Missing required payment information" },
        { status: 400 }
      );
    }

    // Validate card number
    if (!tranzilaService.validateCardNumber(cardNumber)) {
      return NextResponse.json(
        { message: "Invalid card number" },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create pending payment record
    const payment = new Payment({
      userId,
      type: "classpack",
      amount,
      status: "pending",
      metadata: {
        packName,
        packType,
        totalClasses,
        validityMonths,
      },
    });
    await payment.save();

    // Generate invoice number
    const invoiceNumber = `CP-${Date.now()}-${userId.toString().slice(-6)}`;

    try {
      // Process payment through Tranzila
      const paymentResult = await tranzilaService.processOneTimePayment({
        amount,
        cardNumber,
        cvv,
        expiryMonth,
        expiryYear,
        cardHolderName,
        cardHolderId,
        email: user.email,
        description: `Class Pack: ${packName}`,
        invoiceNumber,
      });

      if (paymentResult.success) {
        // Update payment record
        payment.status = "completed";
        payment.tranzilaTransactionId = paymentResult.transactionId;
        payment.tranzilaConfirmationCode = paymentResult.confirmationCode;
        payment.tranzilaResponse = paymentResult.rawResponse;
        await payment.save();

        // Calculate expiration date
        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + validityMonths);

        // Create class pack
        const classPack = new ClassPack({
          userId,
          packName,
          packType,
          totalClasses,
          remainingClasses: totalClasses,
          amount,
          validUntil,
          paymentId: payment._id,
          status: "active",
        });
        await classPack.save();

        // Update payment with class pack reference
        payment.classPackId = classPack._id;
        await payment.save();

        return NextResponse.json({
          success: true,
          message: "Class pack purchased successfully",
          classPack: {
            id: classPack._id,
            packName: classPack.packName,
            totalClasses: classPack.totalClasses,
            remainingClasses: classPack.remainingClasses,
            validUntil: classPack.validUntil,
          },
          payment: {
            transactionId: paymentResult.transactionId,
            confirmationCode: paymentResult.confirmationCode,
            amount: payment.amount,
          },
        });
      } else {
        // Payment failed
        payment.status = "failed";
        payment.tranzilaResponse = paymentResult.rawResponse;
        await payment.save();

        return NextResponse.json(
          {
            success: false,
            message: paymentResult.responseMessage || "Payment failed",
            errorCode: paymentResult.responseCode,
          },
          { status: 400 }
        );
      }
    } catch (error) {
      // Update payment status to failed
      payment.status = "failed";
      payment.metadata = {
        ...payment.metadata,
        error: error.message,
      };
      await payment.save();

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
