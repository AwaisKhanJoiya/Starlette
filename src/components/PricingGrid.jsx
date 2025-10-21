"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import PricingCard from "./PricingCard";
import { useLocale, useTranslations } from "next-intl";
// import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
// import DownloadApp from "@/components/DownloadApp";

export default function PricingGrid({
  cards = [],
  columns = 3,
  // backgroundImage = "/light-logo.jpg",
  backgroundImage = "/hd-logo.png",
  headerImage = "/welcome-pack.jpg",
  bullets = [],
  packageName,
}) {
  const t = useTranslations("home");

  const locale = useLocale();
  const gridClass = useMemo(() => {
    if (columns === 2)
      return "flex flex-col md:flex-row justify-center items-center gap-8";
    if (columns === 4)
      return "grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center";
    return "flex flex-col md:flex-row justify-center items-center gap-8";
  }, [columns]);

  let spaces = 0;

  return (
    <section>
      <div className="pr-2 md:flex hidden flex-col md:flex-row justify-between items-end mb-8 pt-12">
        <div className="flex-1">
          <div className="space-y-4">
            <div className="h-[2px] mr-4 bg-dark-gray"></div>
            <div className="h-[2px] bg-dark-gray"></div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="circular-text-container">
            <div className="circular-text">
              {packageName.split("").map((char, i) => {
                if (char === " ") spaces += 1;
                return (
                  <span
                    key={i}
                    className="text-dark-gray  font-bold text-sm md:text-base origin-[0_80px]"
                    style={{
                      transform: `rotate(${
                        i * (360 / packageName.length - (16 + spaces)) - 50
                      }deg)`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            <div className="circular-image w-28 h-28">
              <Image
                src={headerImage}
                alt="globe"
                width={150}
                height={150}
                className="object-contain rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view for the package title and image */}
      <div className="px-4 lg:px-8 md:hidden flex flex-col items-center mb-8 pt-6">
        <div className="mb-4">
          <div className="space-y-4">
            <div className="h-[2px] bg-dark-gray"></div>
            <div className="h-[2px] bg-dark-gray"></div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="circular-text-container">
            <div className="circular-text">
              {packageName.split("").map((char, i) => (
                <span
                  key={i}
                  className="text-dark-gray font-bold text-sm origin-[0_70px]"
                  style={{
                    transform: `rotate(${
                      i * (360 / packageName.length - (15 + spaces)) - 50
                    }deg)`,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="circular-image w-24 h-24">
              <Image
                src={headerImage}
                alt="globe"
                width={90}
                height={90}
                className="object-contain rounded-full w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative pt-6 pb-8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
          }}
        />

        <div className={`relative z-10 ${gridClass}`}>
          {cards.map((c) => (
            <PricingCard key={c.id} data={c} />
          ))}
        </div>
      </div>

      {bullets && bullets.length > 0 && (
        <div
          className={`${
            locale === "he" ? "rtl" : ""
          } relative z-10 mt-6 text-xs md:text-sm  px-4 sm:ps-6 lg:ps-8 `}
        >
          {bullets.map((b, i) => (
            <div key={i} className="mb-1 flex items-start">
              <span className="text-dark-gray font-bold mr-2">★</span>
              <span className="text-light-gray">{b}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
