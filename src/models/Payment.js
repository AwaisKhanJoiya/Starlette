import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [1, 4],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "ILS",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true,
    },
    pricingId: {
      type: String,
      required: true,
    },
    takbullUniqueId: {
      type: String,
    },
    takbullResponse: mongoose.Schema.Types.Mixed,
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    classPackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassPack",
    },
    refundedAt: Date,
    refundAmount: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
