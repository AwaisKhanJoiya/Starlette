import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Class title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Class description is required"],
      trim: true,
    },
    // Replace instructor with coach reference
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: [true, "Coach is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    // Add new fields
    classType: {
      type: String,
      required: [true, "Class type is required"],
      enum: ["lagree", "intro", "advanced", "private", "special", "other"],
      default: "lagree",
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    waitlistEnabled: {
      type: Boolean,
      default: false,
    },
    recurrenceType: {
      type: String,
      enum: ["onetime", "daily", "weekly", "monthly"],
      default: "onetime",
    },
    recurrenceEndDate: {
      type: Date,
      // Required only if recurrenceType is not "onetime"
      validate: {
        validator: function (value) {
          return this.recurrenceType === "onetime" || value !== undefined;
        },
        message: "End date is required for recurring classes",
      },
    },
    daysOfWeek: {
      // For weekly recurrence, which days of the week (0=Sunday, 1=Monday, etc.)
      type: [Number],
      validate: {
        validator: function (value) {
          if (this.recurrenceType !== "weekly") return true;
          return value && value.length > 0;
        },
        message: "Days of week are required for weekly recurring classes",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledStudents: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["confirmed", "waitlisted", "cancelled"],
          default: "confirmed",
        },
      },
    ],
  },
  { timestamps: true }
);

// Create methods to check if class is full
classSchema.methods.isClassFull = function () {
  const confirmedStudents = this.enrolledStudents.filter(
    (student) => student.status === "confirmed"
  ).length;
  return confirmedStudents >= this.capacity;
};

// Create a method to enroll a student
classSchema.methods.enrollStudent = function (studentId) {
  // Check if student is already enrolled
  const existingEnrollment = this.enrolledStudents.find(
    (student) => student.studentId.toString() === studentId.toString()
  );

  if (existingEnrollment) {
    return { success: false, message: "Student already enrolled" };
  }

  // Check if class is full
  if (this.isClassFull()) {
    // Add to waitlist
    this.enrolledStudents.push({
      studentId,
      status: "waitlisted",
    });
    return { success: true, message: "Added to waitlist" };
  }

  // Add as confirmed enrollment
  this.enrolledStudents.push({
    studentId,
    status: "confirmed",
  });
  return { success: true, message: "Enrollment confirmed" };
};

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);

export default Class;
