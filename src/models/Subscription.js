import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    classesPerWeek: {
      type: Number,
      required: true,
    },
    classesPerMonth: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "cancelled", "expired", "paused"],
      default: "pending",
      index: true,
    },
    takbullSubscriptionId: String,
    startDate: {
      type: Date,
    },
    nextBillingDate: Date,
    endDate: Date,
    cancelledAt: Date,
    cancellationReason: String,
    minimumCommitmentEndDate: Date, // 3 months from start
  },
  { timestamps: true }
);

// Check if subscription can be cancelled (1 month notice required)
SubscriptionSchema.methods.canBeCancelled = function () {
  const now = new Date();

  // Check if minimum commitment period has passed
  if (this.minimumCommitmentEndDate && now < this.minimumCommitmentEndDate) {
    return {
      allowed: false,
      reason: "Minimum 3-month commitment period has not been met",
    };
  }

  return {
    allowed: true,
    effectiveDate: new Date(now.setMonth(now.getMonth() + 1)), // 1 month from now
  };
};

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
