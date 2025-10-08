import mongoose from "mongoose";
import bcrypt from "bcrypt";

const CoachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide coach name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide coach email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false, // Don't return password in queries
  },
  phone: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  specialties: {
    type: [String],
    default: [],
  },
  profileImage: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  languages: {
    type: [String],
    default: ["English"],
  },
});

// Hash password before saving
CoachSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
CoachSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Coach = mongoose.models.Coach || mongoose.model("Coach", CoachSchema);

export default Coach;
