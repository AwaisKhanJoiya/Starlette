"use client";

import { useState } from "react";
import { useUserAuthContext } from "@/context/UserAuthContext";
import { purchaseClassPack } from "@/services/paymentService";

/**
 * Custom hook for handling class pack (one-time) payments
 * @returns {Object} Payment state and handlers
 */
export function useClassPackPayment() {
  const { getAuthToken } = useUserAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /**
   * Process class pack purchase
   * @param {Object} packDetails - Details of the class pack
   * @param {string} packDetails.packName - Name of the pack
   * @param {string} packDetails.packType - Type/ID of the pack
   * @param {number} packDetails.totalClasses - Total number of classes
   * @param {number} packDetails.amount - Payment amount
   * @param {number} packDetails.validityMonths - Validity period in months
   * @param {Object} cardDetails - Card payment information
   * @param {string} cardDetails.cardNumber - Card number
   * @param {string} cardDetails.cvv - CVV code
   * @param {string} cardDetails.expiryMonth - Expiry month
   * @param {string} cardDetails.expiryYear - Expiry year
   * @param {string} cardDetails.cardHolderName - Cardholder name
   * @param {string} cardDetails.cardHolderId - Cardholder ID
   * @returns {Promise<Object>} Payment result
   */
  const purchasePack = async (packDetails, cardDetails) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login to make a purchase");
      }

      const paymentData = {
        ...packDetails,
        ...cardDetails,
      };

      const data = await purchaseClassPack(paymentData, token);

      setResult({
        type: "success",
        message: "Class pack purchased successfully!",
        classPack: data.classPack,
        payment: data.payment,
      });

      return data;
    } catch (err) {
      const errorMessage = err.message || "Failed to process payment";
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
    setResult(null);
  };

  return {
    loading,
    error,
    result,
    purchasePack,
    reset,
    isProcessing: loading,
    isSuccess: !!result,
    hasError: !!error,
  };
}

export default useClassPackPayment;
