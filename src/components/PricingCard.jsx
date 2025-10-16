"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

const PricingCard = React.memo(function PricingCard({ data = {} }) {
  const locale = useLocale();
  const router = useRouter();
  const {
    slug = "",
    price = "",
    headline = "",
    gift = "",
    buttonLabel = "BOOK",
    star = "★",
    onClick = null,
  } = data;

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
      return;
    }
    // default behaviour: navigate to '/'
    router.push("/");
  };

  return (
    <div className="relative">
      <div className=" border-2 text-dark-gray border-black bg-white rounded-3xl py-8 px-4 w-72 md:w-60 text-center shadow-sm">
        {slug && (
          <div className="text-xs md:text-sm mb-2 font-bold text-primary">
            {slug}
          </div>
        )}

        <div className="text-4xl md:text-5xl font-bold mb-2 text-black">
          {price}
        </div>
        <div className="text-2xl md:text-3xl font-bold mb-2 text-light-gray">
          {star}
        </div>
        {headline && (
          <div
            dir={locale === "he" ? "rtl" : undefined}
            className="text-lg md:text-xl trea font-bold mb-1 tracking-widest text-[#787C7C]"
          >
            {headline}
          </div>
        )}
        {gift && (
          <p
            dir={locale === "he" ? "rtl" : undefined}
            className="text-[10px] font-bold mb-6 text-[#787C7C]"
          >
            {gift}
          </p>
        )}
      </div>
      <p className="absolute right-3 top-6 -rotate-90 origin-right text-[11px] font-bold mb-6 text-[#b8b6b3]">
        valid for 1 month
      </p>

      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={handleClick}
          className="bg-secondary border border-black text-dark-gray py-2 px-6 rounded shadow-md"
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
});

export default PricingCard;
