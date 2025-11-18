"use client";

import { useState } from "react";
import { useUserAuthContext } from "@/context/UserAuthContext";
import PaymentForm from "@/components/PaymentForm";
import { redirect } from "next/navigation";

export default function PaymentTestPage() {
  const { getAuthToken } = useUserAuthContext();
  const [activeTab, setActiveTab] = useState("classpack"); // 'classpack' or 'subscription'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Class Pack Options
  const classPackOptions = [
    {
      id: "5_classes",
      name: "5 Classes Pack",
      totalClasses: 5,
      amount: 250,
      validityMonths: 2,
      description: "5 Classes - Valid for 2 months",
    },
    {
      id: "10_classes",
      name: "10 Classes Pack",
      totalClasses: 10,
      amount: 450,
      validityMonths: 3,
      description: "10 Classes - Valid for 3 months",
    },
    {
      id: "20_classes",
      name: "20 Classes Pack",
      totalClasses: 20,
      amount: 800,
      validityMonths: 6,
      description: "20 Classes - Valid for 6 months",
    },
  ];

  // Subscription Plans
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Monthly",
      amount: 4,
      classesPerWeek: 1,
      classesPerMonth: 4,
      description: "1 class per week (4 per month)",
    },
    {
      id: "standard",
      name: "Standard Monthly",
      amount: 350,
      classesPerWeek: 2,
      classesPerMonth: 8,
      description: "2 classes per week (8 per month)",
    },
    {
      id: "premium",
      name: "Premium Monthly",
      amount: 500,
      classesPerWeek: 3,
      classesPerMonth: 12,
      description: "3 classes per week (12 per month)",
    },
  ];

  const [selectedClassPack, setSelectedClassPack] = useState(
    classPackOptions[0]
  );
  const [selectedSubscription, setSelectedSubscription] = useState(
    subscriptionPlans[0]
  );

  const handleClassPackPurchase = async (paymentData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch("/api/payments/classpack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packName: selectedClassPack.name,
          packType: selectedClassPack.id,
          totalClasses: selectedClassPack.totalClasses,
          amount: selectedClassPack.amount,
          validityMonths: selectedClassPack.validityMonths,
          ...paymentData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          type: "success",
          title: "Class Pack Purchased!",
          data: data,
        });
      } else {
        setError(data.message || "Payment failed");
      }
    } catch (err) {
      setError(err.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionPurchase = async (paymentData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: selectedSubscription.amount,
        }),
      });

      const data = await response.json();

      if (data.responseCode === 0) {
        setResult({
          type: "success",
          title: "Subscription Created!",
          data: data,
        });
        window.location.href = data.url;
      } else {
        setError(data.message || "Subscription creation failed");
      }
    } catch (err) {
      setError(err.message || "Subscription processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-2">
            Payment Gateway Test
          </h1>
          <p className="text-gray-600">
            Test Tranzila payment integration for class packs and subscriptions
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Test Mode:</strong> Use Tranzila test card numbers
              only. No real charges will be made.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => {
                setActiveTab("classpack");
                setResult(null);
                setError(null);
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "classpack"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-dark-gray"
              }`}
            >
              Class Pack (One-time)
            </button>
            <button
              onClick={() => {
                setActiveTab("subscription");
                setResult(null);
                setError(null);
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "subscription"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-dark-gray"
              }`}
            >
              Subscription (Recurring)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Plan Selection */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-dark-gray mb-4">
                {activeTab === "classpack"
                  ? "Select Class Pack"
                  : "Select Subscription Plan"}
              </h2>

              {activeTab === "classpack" ? (
                <div className="space-y-3">
                  {classPackOptions.map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedClassPack(pack)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedClassPack.id === pack.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-dark-gray">
                          {pack.name}
                        </h3>
                        <span className="text-2xl font-bold text-primary">
                          ₪{pack.amount}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {pack.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {pack.totalClasses} classes • Valid for{" "}
                        {pack.validityMonths} months
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedSubscription(plan)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedSubscription.id === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-dark-gray">
                          {plan.name}
                        </h3>
                        <span className="text-2xl font-bold text-primary">
                          ₪{plan.amount}/mo
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {plan.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Recurring monthly billing • 3-month minimum commitment
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Test Card Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  📝 Test Card Information
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Use Tranzila test cards:</p>
                  <p className="font-mono">
                    Card: Contact Tranzila for test numbers
                  </p>
                  <p className="font-mono">CVV: Any 3 digits</p>
                  <p className="font-mono">Expiry: Any future date</p>
                  <p className="font-mono">ID: Any 9 digits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-dark-gray mb-4">
                Payment Information
              </h2>

              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-2">
                      ✓ {result.title}
                    </h3>
                    <div className="text-sm text-green-800 space-y-2">
                      {activeTab === "classpack" ? (
                        <>
                          <p>
                            <strong>Pack:</strong>{" "}
                            {result.data.classPack?.packName}
                          </p>
                          <p>
                            <strong>Total Classes:</strong>{" "}
                            {result.data.classPack?.totalClasses}
                          </p>
                          <p>
                            <strong>Remaining:</strong>{" "}
                            {result.data.classPack?.remainingClasses}
                          </p>
                          <p>
                            <strong>Valid Until:</strong>{" "}
                            {new Date(
                              result.data.classPack?.validUntil
                            ).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Plan:</strong>{" "}
                            {result.data.subscription?.planName}
                          </p>
                          <p>
                            <strong>Classes per Week:</strong>{" "}
                            {result.data.subscription?.classesPerWeek}
                          </p>
                          <p>
                            <strong>Classes per Month:</strong>{" "}
                            {result.data.subscription?.classesPerMonth}
                          </p>
                          <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(
                              result.data.subscription?.startDate
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Next Billing:</strong>{" "}
                            {new Date(
                              result.data.subscription?.nextBillingDate
                            ).toLocaleDateString()}
                          </p>
                        </>
                      )}
                      <p>
                        <strong>Transaction ID:</strong>{" "}
                        {result.data.payment?.transactionId}
                      </p>
                      <p>
                        <strong>Confirmation:</strong>{" "}
                        {result.data.payment?.confirmationCode}
                      </p>
                      <p>
                        <strong>Amount Paid:</strong> ₪
                        {result.data.payment?.amount}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full py-2 bg-gray-200 text-dark-gray rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Make Another Payment
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <PaymentForm
                    onSubmit={
                      activeTab === "classpack"
                        ? handleClassPackPurchase
                        : handleSubscriptionPurchase
                    }
                    type={activeTab}
                    amount={
                      activeTab === "classpack"
                        ? selectedClassPack.amount
                        : selectedSubscription.amount
                    }
                    description={
                      activeTab === "classpack"
                        ? selectedClassPack.description
                        : selectedSubscription.description
                    }
                    buttonText={
                      activeTab === "classpack"
                        ? "Purchase Class Pack"
                        : "Subscribe Now"
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="cursor-pointer font-semibold text-dark-gray">
              Debug Information (Click to expand)
            </summary>
            <div className="mt-3 text-sm font-mono text-gray-700">
              <p>
                <strong>Active Tab:</strong> {activeTab}
              </p>
              <p>
                <strong>Environment:</strong>{" "}
                {process.env.TRANZILA_SANDBOX_MODE === "true"
                  ? "Sandbox"
                  : "Production"}
              </p>
              {activeTab === "classpack" && (
                <>
                  <p>
                    <strong>Selected Pack:</strong> {selectedClassPack.name}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₪{selectedClassPack.amount}
                  </p>
                </>
              )}
              {activeTab === "subscription" && (
                <>
                  <p>
                    <strong>Selected Plan:</strong> {selectedSubscription.name}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₪{selectedSubscription.amount}
                    /month
                  </p>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
