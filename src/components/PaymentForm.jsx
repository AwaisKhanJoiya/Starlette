"use client";

import { useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";

export default function PaymentForm({
  onSubmit,
  type = "classpack",
  amount,
  description,
  buttonText = "Pay Now",
}) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
    cardHolderName: "",
    cardHolderId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (value.length > 19) value = value.slice(0, 19);
    }

    // Limit CVV to 3 digits
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    // Limit expiry month to 2 digits
    if (name === "expiryMonth") {
      value = value.replace(/\D/g, "").slice(0, 2);
      if (parseInt(value) > 12) value = "12";
    }

    // Limit expiry year to 2 digits
    if (name === "expiryYear") {
      value = value.replace(/\D/g, "").slice(0, 2);
    }

    // Limit ID to 9 digits
    if (name === "cardHolderId") {
      value = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    // if (formData.cardNumber.replace(/\s/g, "").length < 13) {
    //   setError("Please enter a valid card number");
    //   return;
    // }

    // if (formData.cvv.length !== 3) {
    //   setError("Please enter a valid CVV");
    //   return;
    // }

    // if (!formData.expiryMonth || !formData.expiryYear) {
    //   setError("Please enter card expiry date");
    //   return;
    // }

    // if (!formData.cardHolderName.trim()) {
    //   setError("Please enter cardholder name");
    //   return;
    // }

    // if (formData.cardHolderId.length !== 9) {
    //   setError("Please enter a valid ID number (9 digits)");
    //   return;
    // }

    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-primary/10 p-4 rounded-lg border border-primary">
        <p className="text-sm text-dark-gray mb-2">{description}</p>
        <p className="text-3xl font-bold text-dark-gray">₪{amount}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {/* 
      <div>
        <label className="block text-sm font-medium mb-1 text-dark-gray">
          Card Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-gray">
            Month <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="expiryMonth"
            value={formData.expiryMonth}
            onChange={handleChange}
            placeholder="MM"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-gray">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="expiryYear"
            value={formData.expiryYear}
            onChange={handleChange}
            placeholder="YY"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-gray">
            CVV <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-dark-gray">
          Cardholder Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cardHolderName"
          value={formData.cardHolderName}
          onChange={handleChange}
          placeholder="John Doe"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-dark-gray">
          ID Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cardHolderId"
          value={formData.cardHolderId}
          onChange={handleChange}
          placeholder="123456789"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div> */}

      <LoadingButton
        type="submit"
        isLoading={loading}
        text={buttonText}
        loadingText="Processing..."
        className="w-full"
        variant="primary"
      />

      <p className="text-xs text-gray-500 text-center">
        🔒 Your payment is processed securely by Tranzila
      </p>
    </form>
  );
}
