import ClassPack from "@/models/ClassPack";
import Subscription from "@/models/Subscription";
import Class from "@/models/Class";

/**
 * Booking Service
 * Handles all booking validation logic including subscription and ClassPack checks
 */

/**
 * Get the start and end of the current week (Sunday to Saturday)
 * @returns {Object} Object with startOfWeek and endOfWeek dates
 */
function getCurrentWeekBounds() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate start of week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  // Calculate end of week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

/**
 * Count how many classes a user has attended this week
 * @param {string} userId - User's ID
 * @param {Date} startOfWeek - Start of the current week
 * @param {Date} endOfWeek - End of the current week
 * @returns {Promise<number>} Number of classes attended this week
 */
async function countWeeklyClasses(userId, startOfWeek, endOfWeek) {
  const classes = await Class.find({
    "enrolledStudents.studentId": userId,
    "enrolledStudents.status": "confirmed",
  });

  let weeklyCount = 0;

  for (const classItem of classes) {
    for (const enrollment of classItem.enrolledStudents) {
      if (enrollment.studentId.toString() !== userId) continue;
      if (enrollment.status !== "confirmed") continue;

      // Determine the effective date of the class
      let classDate;
      if (enrollment.instanceDate) {
        // For recurring classes, use the instance date
        classDate = new Date(enrollment.instanceDate);
      } else {
        // For one-time classes, use the class start date
        classDate = new Date(classItem.startDate);
      }

      // Check if this class falls within the current week
      if (classDate >= startOfWeek && classDate <= endOfWeek) {
        weeklyCount++;
      }
    }
  }

  return weeklyCount;
}

/**
 * Check if user has an active subscription
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} Active subscription or null
 */
async function getActiveSubscription(userId) {
  const now = new Date();

  const subscription = await Subscription.findOne({
    userId,
    status: "active",
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: now } },
    ],
  }).sort({ createdAt: -1 }); // Get the most recent active subscription

  return subscription;
}

/**
 * Validate if user can book a class with their subscription
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Validation result
 */
async function validateSubscriptionBooking(userId) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return {
      valid: false,
      reason: "No active subscription found",
      subscription: null,
    };
  }

  // Check weekly class limit
  const { startOfWeek, endOfWeek } = getCurrentWeekBounds();
  const weeklyClassCount = await countWeeklyClasses(
    userId,
    startOfWeek,
    endOfWeek
  );

  if (weeklyClassCount >= subscription.classesPerWeek) {
    return {
      valid: false,
      reason: `Weekly class limit reached (${subscription.classesPerWeek} classes per week)`,
      subscription,
      weeklyClassCount,
    };
  }

  return {
    valid: true,
    reason: "Subscription is valid and weekly limit not reached",
    subscription,
    weeklyClassCount,
  };
}

/**
 * Find a valid ClassPack for the user
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} Valid ClassPack or null
 */
async function findValidClassPack(userId) {
  const now = new Date();

  const classPack = await ClassPack.findOne({
    userId,
    status: "active",
    remainingClasses: { $gt: 0 },
    validUntil: { $gte: now },
  }).sort({ validUntil: 1 }); // Get the one expiring soonest

  return classPack;
}

/**
 * Validate if user can book a class with their ClassPack
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Validation result
 */
async function validateClassPackBooking(userId) {
  const classPack = await findValidClassPack(userId);

  if (!classPack) {
    return {
      valid: false,
      reason:
        "No valid ClassPack found (must be active, not expired, and have remaining classes)",
      classPack: null,
    };
  }

  return {
    valid: true,
    reason: "Valid ClassPack found",
    classPack,
  };
}

/**
 * Main validation function to check if user can book a class
 * Checks both subscription and ClassPack options
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Comprehensive validation result
 */
export async function validateUserCanBook(userId) {
  // Check subscription first
  const subscriptionValidation = await validateSubscriptionBooking(userId);

  if (subscriptionValidation.valid) {
    return {
      canBook: true,
      bookingMethod: "subscription",
      subscription: subscriptionValidation.subscription,
      classPack: null,
      message: "Booking allowed using active subscription",
    };
  }

  // If subscription is not valid, check ClassPack
  const classPackValidation = await validateClassPackBooking(userId);

  if (classPackValidation.valid) {
    return {
      canBook: true,
      bookingMethod: "classpack",
      subscription: null,
      classPack: classPackValidation.classPack,
      message: "Booking allowed using ClassPack",
    };
  }

  // If neither is valid, return detailed error
  return {
    canBook: false,
    bookingMethod: null,
    subscription: subscriptionValidation.subscription,
    classPack: null,
    message: `Cannot book class. ${subscriptionValidation.reason}. ${classPackValidation.reason}`,
    details: {
      subscriptionIssue: subscriptionValidation.reason,
      classPackIssue: classPackValidation.reason,
    },
  };
}

/**
 * Process booking after validation
 * Deduct from ClassPack if that's the booking method
 * @param {string} userId - User's ID
 * @param {string} classId - Class ID
 * @param {Date} classDate - Class date
 * @param {string} bookingMethod - Either 'subscription' or 'classpack'
 * @param {Object} classPack - ClassPack to use (if bookingMethod is 'classpack')
 * @returns {Promise<Object>} Result of processing
 */
export async function processBooking(
  userId,
  classId,
  classDate,
  bookingMethod,
  classPack
) {
  if (bookingMethod === "classpack") {
    if (!classPack) {
      throw new Error(
        "ClassPack is required when booking method is 'classpack'"
      );
    }

    // Use the ClassPack's useClass method to deduct a class
    try {
      await classPack.useClass(classId, classDate);
      return {
        success: true,
        method: "classpack",
        classPackId: classPack._id,
        remainingClasses: classPack.remainingClasses,
        message: `Class booked using ClassPack. ${classPack.remainingClasses} classes remaining.`,
      };
    } catch (error) {
      throw new Error(`Failed to use ClassPack: ${error.message}`);
    }
  } else if (bookingMethod === "subscription") {
    // For subscription, we just track the booking (no deduction needed)
    return {
      success: true,
      method: "subscription",
      message: "Class booked using subscription",
    };
  } else {
    throw new Error("Invalid booking method");
  }
}

/**
 * Get cancellation deadline hours based on user's membership type
 * Subscribed members: 12 hours
 * ClassPack members: 24 hours
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Object with requiredHours and hasSubscription
 */
export async function getCancellationDeadline(userId) {
  const subscription = await getActiveSubscription(userId);

  if (subscription) {
    return {
      requiredHours: 12,
      hasSubscription: true,
      membershipType: "subscription",
    };
  }

  return {
    requiredHours: 24,
    hasSubscription: false,
    membershipType: "classpack",
  };
}

/**
 * Process cancellation and refund ClassPack if applicable
 * @param {string} userId - User's ID
 * @param {string} classId - Class ID that was cancelled
 * @returns {Promise<Object>} Result of cancellation processing
 */
export async function processCancellation(userId, classId) {
  // Find ClassPack that was used for this booking
  const classPack = await ClassPack.findOne({
    userId,
    "usageHistory.classId": classId,
  });

  if (classPack) {
    // Find the usage entry for this class
    const usageIndex = classPack.usageHistory.findIndex(
      (usage) => usage.classId.toString() === classId
    );

    if (usageIndex !== -1) {
      // Remove the usage entry
      classPack.usageHistory.splice(usageIndex, 1);

      // Refund the class
      classPack.remainingClasses += 1;

      // Update status if it was depleted
      if (classPack.status === "depleted" && classPack.remainingClasses > 0) {
        const now = new Date();
        if (now <= classPack.validUntil) {
          classPack.status = "active";
        }
      }

      await classPack.save();

      return {
        success: true,
        refunded: true,
        method: "classpack",
        classPackId: classPack._id,
        remainingClasses: classPack.remainingClasses,
        message: `Class cancelled and refunded to ClassPack. ${classPack.remainingClasses} classes now available.`,
      };
    }
  }

  // If no ClassPack was found, it was likely a subscription booking
  return {
    success: true,
    refunded: false,
    method: "subscription",
    message: "Class cancelled (subscription booking - no refund needed)",
  };
}

const bookingService = {
  validateUserCanBook,
  processBooking,
  processCancellation,
  getCancellationDeadline,
  getActiveSubscription,
  findValidClassPack,
  countWeeklyClasses,
};

export default bookingService;
