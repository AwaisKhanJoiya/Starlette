"use client";

import { useState } from "react";
import { useUserAuthContext } from "@/context/UserAuthContext";
import {
  purchaseClassPack,
  createSubscription,
  cancelSubscription,
  validatePaymentData,
} from "@/services/paymentService";
import takbullConfig from "@/lib/takbull";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Unified payment hook that handles both one-time and recurring payments
 * @param {string} paymentType - Type of payment: 'classpack' or 'subscription'
 * @returns {Object} Payment state and handlers
 */
export function usePayment() {
  const { getAuthToken } = useUserAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [result, setResult] = useState(null);

  /**
   * Process a payment (class pack or subscription)
   * @param {Object} paymentDetails - Payment details (pack or subscription info)
   * @param {Object} cardDetails - Card payment information
   * @returns {Promise<Object>} Payment result
   */
  const processPayment = async (
    paymentDetails,
    paymentType = takbullConfig.dealTypes.REGULAR
  ) => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    setResult(null);

    try {
      const token = getAuthToken();
      if (!token) {
        redirect("/login");
        // throw new Error("Please login to make a purchase");
      }

      let data;

      if (paymentType === takbullConfig.dealTypes.RECURRING) {
        data = await createSubscription(paymentDetails, token);
        setResult({
          type: "subscription",
          message: "Subscription created successfully!",
          subscription: data.subscription,
          payment: data.payment,
        });
      } else {
        data = await purchaseClassPack(paymentDetails, token);
        setResult({
          type: "classpack",
          message: "Class pack purchased successfully!",
          classPack: data.classPack,
          payment: data.payment,
        });
      }
      window.location.href = data.url;

      return data;
    } catch (err) {
      const errorMessage = "Subscription creation failed";
      toast.error(errorMessage);

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
  const cancelSubscriptionPayment = async (subscriptionId, reason = "") => {
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
   * Reset the payment state
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setValidationErrors({});
    setResult(null);
  };

  /**
   * Clear only the error state
   */
  const clearError = () => {
    setError(null);
    setValidationErrors({});
  };

  return {
    // State
    loading,
    error,
    validationErrors,
    result,

    // Actions
    processPayment,
    cancelSubscription: cancelSubscriptionPayment,
    reset,
    clearError,

    // Computed state
    isProcessing: loading,
    isSuccess: !!result,
    hasError: !!error || Object.keys(validationErrors).length > 0,
  };
}

export default usePayment;
