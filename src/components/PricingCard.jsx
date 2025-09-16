"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PricingCard = React.memo(function PricingCard({ data = {} }) {
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
      <div className=" border-2 text-dark-gray border-black rounded-xl py-8 px-4 w-56 md:w-60 text-center shadow-sm">
        {slug && (
          <div className="text-xs md:text-sm mb-2 font-bold text-primary">
            {slug}
          </div>
        )}

        <div className="text-4xl md:text-5xl font-bold mb-2">{price}</div>
        <div className="text-2xl md:text-3xl font-bold mb-2">{star}</div>
        {headline && (
          <div className="text-lg md:text-xl trea font-semibold mb-2 tracking-wider">
            {headline}
          </div>
        )}
        {gift && <div className="text-xs md:text-sm mb-6">{gift}</div>}
      </div>

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
