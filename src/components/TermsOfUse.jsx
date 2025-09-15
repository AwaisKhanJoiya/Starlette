"use client";
import React from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const TermsOfUse = ({ onClose }) => {
  const t = useTranslations("terms");

  return (
    <div className="mt-8   border border-[#000000] p-4 max-w-3xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center  ">
        <h2 className="text-base font-medium text-dark-gray tracking-wide underline">
          {t("title")}
        </h2>
        <button
          onClick={onClose}
          className="text-dark-gray hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 uppercase text-dark-gray text-xs  ">
        <p className="uppercase tracking-wide  ">{t("intro")}</p>

        <div>
          <h3 className="underline">{t("personalUse.title")}</h3>
          <p>{t("personalUse.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("accurateInfo.title")}</h3>
          <p>{t("accurateInfo.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("accountSecurity.title")}</h3>
          <p>{t("accountSecurity.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("booking.title")}</h3>
          <p>{t("booking.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("classPack.title")}</h3>
          <p>{t("classPack.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("subscriptions.title")}</h3>
          <p>{t("subscriptions.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("conduct.title")}</h3>
          <p>{t("conduct.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("safety.title")}</h3>
          <p>{t("safety.text")}</p>
        </div>

        <div>
          <h3 className="underline">{t("privacy.title")}</h3>
          <p>{t("privacy.text")}</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p>
            {t("footer")} <span className="font-medium">STARLETTE</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
