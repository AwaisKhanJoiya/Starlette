import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import takbullConfig from "@/lib/takbull";
import ClassPack from "@/models/ClassPack";

/**
 * Takbull Webhook Handler
 * Processes payment notifications and updates payment/subscription status
 *
 * Webhook Data Structure:
 * - Id: Takbull payment ID
 * - TransactionId: Transaction ID
 * - OrderNumber: Order number
 * - order_reference: Our internal payment reference
 * - StatusCode: Payment status (0 = success)
 * - OrderStatus: Order status
 * - IsSubscriptionPayment: Boolean indicating if it's a subscription
 * - SubscriptionStatusCode: Subscription status
 * - OrderTotalSum: Payment amount
 * - CustomerIdentity: Customer ID number
 * - Token: Payment token for recurring payments
 */
export async function POST(request) {
  try {
    await dbConnect();

    const webhookData = await request.json();

    console.log("TAKBULL WEBHOOK RECEIVED:", {
      id: webhookData.Id,
      transactionId: webhookData.TransactionId,
      orderReference: webhookData.order_reference,
      status: webhookData.StatusCode,
      isSubscription: webhookData.IsSubscriptionPayment,
      amount: webhookData.OrderTotalSum,
    });

    // Validate webhook data
    if (!webhookData.TransactionId && !webhookData.Id) {
      console.error("Invalid webhook: Missing transaction ID");
      return NextResponse.json(
        { error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    // Determine payment status based on StatusCode
    // StatusCode 0 = Success, others are failures
    const isSuccessful =
      webhookData.StatusCode === 0 || webhookData.OrderStatus === 0;

    const paymentStatus = isSuccessful ? "completed" : "failed";
    const subscriptionId =
      webhookData.DealType === 4 ? webhookData.order_reference : null;
    const classPackId =
      webhookData.DealType === 1 ? webhookData.order_reference : null;
    // Handle subscription payment
    if (webhookData.DealType === takbullConfig.dealTypes.RECURRING) {
      await handleSubscriptionWebhook(webhookData, paymentStatus);
      const subscription = await Subscription.findOne({
        _id: subscriptionId,
      });
      await createPaymentRecord(
        {
          ...webhookData,
          subscriptionId,
          classPackId,
          userId: subscription.userId,
        },
        paymentStatus,
        subscription.planId
      );
    } else {
      // Handle one-time payment (class pack)
      await handleOneTimePaymentWebhook(webhookData, paymentStatus);
      const classPack = await ClassPack.findOne({
        _id: classPackId,
      });
      await createPaymentRecord(
        {
          ...webhookData,
          subscriptionId,
          classPackId,
          userId: classPack.userId,
        },
        paymentStatus,
        classPack.planId
      );
    }

    return NextResponse.json(
      {
        message: "Webhook processed successfully",
        status: paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Return 200 to prevent webhook retries for our internal errors
    return NextResponse.json(
      { message: "Webhook received but processing failed" },
      { status: 200 }
    );
  }
}

async function createPaymentRecord(webhookData, paymentStatus, pricingId) {
  try {
    const payment = new Payment({
      userId: webhookData.userId,
      type: webhookData.DealType,
      amount: webhookData.OrderTotalSum,
      currency: "ILS",
      status: paymentStatus,
      pricingId,
      takbullUniqueId: webhookData.uniqId,
      takbullResponse: webhookData,
      transactionId: webhookData.TransactionId,
      orderReference: webhookData.order_reference,
      takbullPaymentId: webhookData.Id,
      takbullSubscriptionId: webhookData.Token,
      ...(webhookData.subscriptionId && {
        subscriptionId: webhookData.subscriptionId,
      }),
      ...(webhookData.classPack && {
        classPackId: webhookData.classPackId,
      }),
      metadata: {
        orderNumber: webhookData.OrderNumber,
        customerIdentity: webhookData.CustomerIdentity,
      },
    });
    await payment.save();
  } catch (error) {
    console.error("Error creating payment record:", error);
    throw error;
  }
}

/**
 * Handle subscription payment webhook
 */
async function handleSubscriptionWebhook(webhookData, paymentStatus) {
  try {
    // Find payment by Takbull ID or unique ID

    // Update subscription if payment is successful
    if (paymentStatus === "completed") {
      const subscription = await Subscription.findOne({
        _id: webhookData.order_reference,
      });

      if (subscription) {
        // Update subscription with payment token if provided
        if (webhookData.Token) {
          subscription.takbullSubscriptionId = webhookData.Token;
        }

        // If this is the initial payment, activate subscription
        if (
          subscription.status === "pending" ||
          webhookData.InitialRecuringPaymentStatusCode === 0
        ) {
          subscription.status = "active";
          subscription.startDate = subscription.startDate || new Date();

          // Set next billing date (1 month from now)
          const nextBilling = new Date();
          nextBilling.setMonth(nextBilling.getMonth() + 1);
          subscription.nextBillingDate = nextBilling;

          // Set minimum commitment end date (3 months from start)
          const commitmentEnd = new Date(subscription.startDate);
          commitmentEnd.setMonth(commitmentEnd.getMonth() + 3);
          subscription.minimumCommitmentEndDate = commitmentEnd;

          console.log(`Subscription ${subscription._id} activated`);
        }

        // Update subscription status based on webhook
        if (webhookData.SubscriptionStatusCode !== undefined) {
          // SubscriptionStatusCode: 0 = active, 1 = cancelled, etc.
          if (webhookData.SubscriptionStatusCode === 1) {
            subscription.status = "cancelled";
            subscription.cancelledAt = new Date();
          } else if (webhookData.SubscriptionStatusCode !== 0) {
            subscription.status = "paused";
          }
        }

        await subscription.save();
      }
    } else {
      // Payment failed - update subscription
      const subscription = await Subscription.findOne({
        _id: webhookData.order_reference,
      });

      if (subscription) {
        // If initial payment failed, mark subscription as cancelled
        if (subscription.status === "pending") {
          subscription.status = "cancelled";
          subscription.cancelledAt = new Date();
          subscription.cancellationReason = "Initial payment failed";
          await subscription.save();
          console.log(
            `Subscription ${subscription._id} cancelled due to payment failure`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error handling subscription webhook:", error);
    throw error;
  }
}

/**
 * Handle one-time payment webhook (class pack)
 */
async function handleOneTimePaymentWebhook(webhookData, paymentStatus) {
  try {
    // If payment failed, you might want to update the associated class pack
    if (paymentStatus === "failed" && webhookData.order_reference) {
      const classPack = await ClassPack.findById(webhookData.order_reference);

      if (classPack && classPack.status === "pending") {
        classPack.status = "expired";
        await classPack.save();
        console.log(
          `Class pack ${classPack._id} marked as expired due to payment failure`
        );
      }
    } else if (paymentStatus === "completed" && webhookData.order_reference) {
      const classPack = await ClassPack.findById(webhookData.order_reference);

      if (classPack && classPack.status === "pending") {
        classPack.status = "active";
        await classPack.save();
        console.log(
          `Class pack ${classPack._id} marked as active due to payment success`
        );
      }
    }
  } catch (error) {
    console.error("Error handling one-time payment webhook:", error);
    throw error;
  }
}

/**
 * GET handler for webhook verification (if needed)
 */
export async function GET(request) {
  return NextResponse.json(
    { message: "Takbull Webhook Endpoint" },
    { status: 200 }
  );
}
