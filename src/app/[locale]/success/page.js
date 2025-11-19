"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Home, User } from "lucide-react";
import ProtectedPage from "@/components/ProtectedPage";
import { Link } from "@/i18n/navigation";

export default function SuccessPage() {
  const t = useTranslations("success");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Get payment details from URL params
    const transactionId = searchParams.get("transactionId");
    const amount = searchParams.get("amount");
    const type = searchParams.get("type"); // 'classpack' or 'subscription'

    if (transactionId || amount || type) {
      setPaymentDetails({
        transactionId,
        amount,
        type,
      });
    }
  }, [searchParams]);

  const isRTL = locale === "he";

  return (
    <ProtectedPage>
      <div
        className={`min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 ${
          isRTL ? "rtl" : ""
        }`}
      >
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
              {t("title")}
            </h1>

            <p className="text-lg text-gray-600 mb-2">{t("subtitle")}</p>
          </div>

          {/* Success Message Card */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <p className="text-gray-700 text-center mb-6">{t("message")}</p>

            {/* Transaction Details */}
            {paymentDetails?.transactionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm text-gray-600 font-semibold">
                    {t("transactionId")}:
                  </span>
                  <span className="text-sm font-mono text-gray-800 break-all">
                    {paymentDetails.transactionId}
                  </span>
                </div>

                {paymentDetails.amount && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600 font-semibold">
                      Amount Paid:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ₪{paymentDetails.amount}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-base font-semibold uppercase flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  {t("viewProfile")}
                  <ArrowRight
                    className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-6 text-base font-semibold uppercase flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  {t("backHome")}
                </Button>
              </Link>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-dark-gray mb-6 text-center">
              {t("whatNext")}
            </h2>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <p className="text-gray-700 pt-1">{t("steps.one")}</p>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <p className="text-gray-700 pt-1">{t("steps.two")}</p>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <p className="text-gray-700 pt-1">{t("steps.three")}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {/* <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {paymentDetails?.type === "subscription"
                ? "Your subscription is now active. You will be billed monthly."
                : "Your class pack is now available in your profile."}
            </p>
          </div> */}
        </div>
      </div>
    </ProtectedPage>
  );
}
