"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import Image from "next/image";

const PricingCard = React.memo(function PricingCard({ data = {} }) {
  const locale = useLocale();
  const router = useRouter();
  const {
    slug = "",
    price = "",
    headline = "",
    gift = "",
    buttonLabel = "BOOK",
    star = "/star-icon.png",
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
      <div
        className={`border-2 h-full flex flex-col justify-between text-dark-gray border-black bg-background rounded-3xl py-8 px-5 text-center shadow-sm ${
          slug
            ? "min-w-72 md:min-w-60 max-w-72 md:max-w-64"
            : "max-w-72 md:max-w-64"
        }`}
      >
        {slug && (
          <div className="text-xs md:text-sm mb-2 font-bold text-secondary">
            “{slug}”
          </div>
        )}

        <div className="text-4xl md:text-5xl font-bold mb-2 text-black">
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
      <p className="absolute right-3 top-6 -rotate-90 origin-right text-[11px] font-normal mb-6 text-[#b8b6b3]">
        valid for 1 month
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
