"use client";

import { useState } from "react";
import { useUserAuthContext } from "@/context/UserAuthContext";
import {
  createSubscription,
  cancelSubscription,
} from "@/services/paymentService";

/**
 * Custom hook for handling subscription (recurring) payments
 * @returns {Object} Subscription state and handlers
 */
export function useSubscriptionPayment() {
  const { getAuthToken } = useUserAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /**
   * Create a new subscription
   * @param {Object} planDetails - Details of the subscription plan
   * @param {string} planDetails.planName - Name of the plan
   * @param {number} planDetails.amount - Monthly payment amount
   * @param {number} planDetails.classesPerWeek - Classes per week
   * @param {number} planDetails.classesPerMonth - Classes per month
   * @param {Object} cardDetails - Card payment information
   * @param {string} cardDetails.cardNumber - Card number
   * @param {string} cardDetails.cvv - CVV code
   * @param {string} cardDetails.expiryMonth - Expiry month
   * @param {string} cardDetails.expiryYear - Expiry year
   * @param {string} cardDetails.cardHolderName - Cardholder name
   * @param {string} cardDetails.cardHolderId - Cardholder ID
   * @returns {Promise<Object>} Subscription result
   */
  const subscribe = async (planDetails, cardDetails) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login to create a subscription");
      }

      const subscriptionData = {
        ...planDetails,
        ...cardDetails,
      };

      const data = await createSubscription(subscriptionData, token);

      setResult({
        type: "success",
        message: "Subscription created successfully!",
        subscription: data.subscription,
        payment: data.payment,
      });

      return data;
    } catch (err) {
      const errorMessage = err.message || "Failed to create subscription";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel an active subscription
   * @param {string} subscriptionId - ID of the subscription to cancel
   * @param {string} reason - Reason for cancellation (optional)
   * @returns {Promise<Object>} Cancellation result
   */
  const cancel = async (subscriptionId, reason = "") => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login to cancel subscription");
      }

      const data = await cancelSubscription(subscriptionId, reason, token);

      setResult({
        type: "cancelled",
        message: "Subscription cancelled successfully",
        subscription: data.subscription,
      });

      return data;
    } catch (err) {
      const errorMessage = err.message || "Failed to cancel subscription";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the subscription state
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    loading,
    error,
    result,
    subscribe,
    cancel,
    reset,
    isProcessing: loading,
    isSuccess: !!result,
    hasError: !!error,
  };
}

export default useSubscriptionPayment;
