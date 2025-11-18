/**
 * Payment Service
 * Handles API calls for payments (class packs and subscriptions)
 */

/**
 * Purchase a class pack (one-time payment)
 * @param {Object} paymentData - Payment information
 * @param {string} paymentData.packName - Name of the class pack
 * @param {string} paymentData.packType - Type/ID of the pack
 * @param {number} paymentData.totalClasses - Total number of classes
 * @param {number} paymentData.amount - Payment amount
 * @param {number} paymentData.validityMonths - Validity period in months
 * @param {string} paymentData.cardNumber - Credit card number
 * @param {string} paymentData.cvv - Card CVV
 * @param {string} paymentData.expiryMonth - Card expiry month
 * @param {string} paymentData.expiryYear - Card expiry year
 * @param {string} paymentData.cardHolderName - Name on card
 * @param {string} paymentData.cardHolderId - ID number of cardholder
 * @param {string} authToken - JWT authentication token
 * @returns {Promise<Object>} Payment result
 */
export async function purchaseClassPack(paymentData, authToken) {
  if (!authToken) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch("/api/payments/classpack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to process class pack purchase");
  }

  if (!data.success) {
    throw new Error(data.message || "Payment failed");
  }

  return data;
}

/**
 * Create a subscription (recurring payment)
 * @param {Object} subscriptionData - Subscription information
 * @param {string} subscriptionData.planName - Name of the subscription plan
 * @param {number} subscriptionData.amount - Monthly payment amount
 * @param {number} subscriptionData.classesPerWeek - Classes per week
 * @param {number} subscriptionData.classesPerMonth - Classes per month
 * @param {string} subscriptionData.cardNumber - Credit card number
 * @param {string} subscriptionData.cvv - Card CVV
 * @param {string} subscriptionData.expiryMonth - Card expiry month
 * @param {string} subscriptionData.expiryYear - Card expiry year
 * @param {string} subscriptionData.cardHolderName - Name on card
 * @param {string} subscriptionData.cardHolderId - ID number of cardholder
 * @param {string} authToken - JWT authentication token
 * @returns {Promise<Object>} Subscription result
 */
export async function createSubscription(subscriptionData, authToken) {
  if (!authToken) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch("/api/payments/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(subscriptionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create subscription");
  }

  if (data.responseCode !== 0) {
    throw new Error(data.message || "Subscription creation failed");
  }

  return data;
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - ID of the subscription to cancel
 * @param {string} reason - Reason for cancellation
 * @param {string} authToken - JWT authentication token
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelSubscription(subscriptionId, reason, authToken) {
  if (!authToken) {
    throw new Error("Authentication required. Please login first.");
  }

  if (!subscriptionId) {
    throw new Error("Subscription ID is required");
  }

  const response = await fetch("/api/payments/subscription/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      subscriptionId,
      reason: reason || "User requested cancellation",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel subscription");
  }

  if (!data.success) {
    throw new Error(data.message || "Subscription cancellation failed");
  }

  return data;
}

/**
 * Validate payment card data
 * @param {Object} cardData - Card information to validate
 * @returns {Object} Validation result with errors
 */
export function validatePaymentData(cardData) {
  const errors = {};

  // Validate card number
  const cleanCardNumber = cardData.cardNumber?.replace(/\s/g, "") || "";
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    errors.cardNumber = "Please enter a valid card number";
  }

  // Validate CVV
  if (!cardData.cvv || cardData.cvv.length !== 3) {
    errors.cvv = "Please enter a valid CVV (3 digits)";
  }

  // Validate expiry month
  const month = parseInt(cardData.expiryMonth);
  if (!cardData.expiryMonth || month < 1 || month > 12) {
    errors.expiryMonth = "Please enter a valid month (01-12)";
  }

  // Validate expiry year
  const currentYear = new Date().getFullYear() % 100;
  const year = parseInt(cardData.expiryYear);
  if (!cardData.expiryYear || year < currentYear) {
    errors.expiryYear = "Card has expired";
  }

  // Validate cardholder name
  if (!cardData.cardHolderName || cardData.cardHolderName.trim().length < 3) {
    errors.cardHolderName = "Please enter cardholder name";
  }

  // Validate ID number (Israeli ID - 9 digits)
  if (!cardData.cardHolderId || cardData.cardHolderId.length !== 9) {
    errors.cardHolderId = "Please enter a valid ID number (9 digits)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

const paymentService = {
  purchaseClassPack,
  createSubscription,
  cancelSubscription,
  validatePaymentData,
};

export default paymentService;
