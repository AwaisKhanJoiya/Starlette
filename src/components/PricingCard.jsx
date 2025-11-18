"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import Image from "next/image";
import usePayment from "@/hooks/usePayment";
import { PRICES } from "@/lib/pricing";

const PricingCard = React.memo(function PricingCard({ data = {} }) {
  const { processPayment } = usePayment();
  const locale = useLocale();
  const {
    id = "",
    slug = "",
    price = "",
    headline = "",
    validity = "",
    gift = "",
    buttonLabel = "BOOK",
    star = "/star-icon.png",
  } = data;

  const handleClick = () => {
    const pricingCard = PRICES.find((card) => card.id === id);
    processPayment({ id }, pricingCard.type);
  };

  return (
    <div className="relative">
      <div
        className={`border-2 flex flex-col justify-center gap-y-4 text-dark-gray border-black bg-background rounded-3xl py-8 w-64 h-64 ${
          gift ? "px-2" : "px-5"
        } text-center shadow-sm ${
          slug
            ? "min-w-72 md:min-w-60 max-w-72 md:max-w-64"
            : "max-w-72 md:max-w-64"
        }`}
      >
        {slug && (
          <div className="text-xs md:text-sm font-bold text-secondary absolute top-3 left-1/2 transform -translate-x-1/2 w-full">
            “{slug}”
          </div>
        )}

        <div
          className={`text-4xl md:text-5xl font-bold mb-2 text-black ${
            slug ? "mt-6" : ""
          }`}
        >
          {price}
        </div>
        <div>
          <Image
            src={star}
            alt="star icon"
            width={24}
            height={24}
            className="mx-auto mb-4"
          />
        </div>
        <div>
          {headline && (
            <div
              dir={locale === "he" ? "rtl" : undefined}
              className="text-lg md:text-2xl trea font-bold mb-1 tracking-widest text-[#787C7C]"
            >
              {headline}
            </div>
          )}
          {gift && (
            <p
              dir={locale === "he" ? "rtl" : undefined}
              className="text-[9px] font-bold mb-2 text-[#787C7C] mt-1"
            >
              {gift}
            </p>
          )}
        </div>
      </div>
      <p className="absolute right-4 translate-x-1/2 top-1/2 text-center -translate-y-1/2 -rotate-90 text-[11px] font-normal text-[#b8b6b3] whitespace-nowrap">
        {validity}
      </p>

      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={handleClick}
          className="bg-secondary border border-black text-dark-gray py-4 h-10 px-6 rounded-lg shadow-md"
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
});

export default PricingCard;
