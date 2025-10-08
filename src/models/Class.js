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
      trim: true,
      // Now optional, will be calculated as startTime + 50 minutes if not provided
    },
    duration: {
      type: Number,
      default: 50, // Default duration is 50 minutes
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
      max: [5, "Maximum capacity is 5 students"],
      default: 5,
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
      default: ["Hebrew"], // Changed default from English to Hebrew
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
        // For recurring classes - track which specific instance was booked
        instanceId: {
          type: String, // Format: original_class_id_YYYY-MM-DD
        },
        instanceDate: {
          type: Date, // The specific date of this recurring instance
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

// Create a method to check if a specific instance of a class is full
classSchema.methods.isInstanceFull = function (instanceId) {
  // If no instanceId provided, use the regular isClassFull method
  if (!instanceId) {
    return this.isClassFull();
  }

  // Count confirmed students for this specific instance
  const confirmedStudents = this.enrolledStudents.filter(
    (student) =>
      student.status === "confirmed" && student.instanceId === instanceId
  ).length;

  return confirmedStudents >= this.capacity;
};

// Create a method to enroll a student
classSchema.methods.enrollStudent = function (studentId, metadata = {}) {
  // Extract instance information for recurring classes
  const { instanceId, date } = metadata;

  // For recurring classes with instance data, check if student is enrolled in THIS specific instance
  const existingEnrollment = instanceId
    ? this.enrolledStudents.find(
        (student) =>
          student.studentId.toString() === studentId.toString() &&
          student.instanceId === instanceId
      )
    : this.enrolledStudents.find(
        (student) => student.studentId.toString() === studentId.toString()
      );

  if (existingEnrollment) {
    return {
      success: false,
      message: "Student already enrolled in this class instance",
    };
  }

  // Check if class is full, considering the specific instance for recurring classes
  const isClassFull = instanceId
    ? this.isInstanceFull(instanceId)
    : this.isClassFull();

  // If class is full and waitlist is not enabled, reject enrollment
  if (isClassFull && !this.waitlistEnabled) {
    return {
      success: false,
      message: "Class is full and waitlist is not enabled",
    };
  }

  // Enrollment data to add
  const enrollmentData = {
    studentId,
    status: isClassFull ? "waitlisted" : "confirmed",
  };

  // Add instance metadata for recurring classes if available
  if (instanceId) {
    enrollmentData.instanceId = instanceId;
  }

  if (date) {
    enrollmentData.instanceDate = new Date(date);
  }

  // Add to waitlist or confirmed based on capacity
  this.enrolledStudents.push(enrollmentData);

  return {
    success: true,
    message: isClassFull ? "Added to waitlist" : "Enrollment confirmed",
  };
};

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);

export default Class;
