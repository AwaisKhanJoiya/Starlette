import mongoose from "mongoose";

const ClassPackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  packName: {
    type: String,
    required: true,
  },
  packType: {
    type: String,
    required: true, // e.g., "10_classes", "20_classes", etc.
  },
  totalClasses: {
    type: Number,
    required: true,
  },
  remainingClasses: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "depleted"],
    default: "active",
    index: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  usageHistory: [
    {
      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      usedAt: {
        type: Date,
        default: Date.now,
      },
      classDate: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
ClassPackSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Auto-update status based on conditions
  if (this.remainingClasses <= 0) {
    this.status = "depleted";
  } else if (new Date() > this.validUntil) {
    this.status = "expired";
  }

  next();
});

// Method to use a class from the pack
ClassPackSchema.methods.useClass = function (classId, classDate) {
  if (this.remainingClasses <= 0) {
    throw new Error("No classes remaining in this pack");
  }

  if (new Date() > this.validUntil) {
    throw new Error("This class pack has expired");
  }

  this.remainingClasses -= 1;
  this.usageHistory.push({
    classId,
    classDate,
    usedAt: new Date(),
  });

  return this.save();
};

export default mongoose.models.ClassPack ||
  mongoose.model("ClassPack", ClassPackSchema);
