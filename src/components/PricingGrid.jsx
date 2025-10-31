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
  packImage = "/welcome-pack.png",
  bullets = [],
}) {
  const t = useTranslations("home");

  const locale = useLocale();
  const gridClass = useMemo(() => {
    if (columns === 2)
      return "flex flex-col md:flex-row justify-center items-center gap-32";
    if (columns === 4)
      return "grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center";
    return "flex flex-col md:flex-row justify-center items-center gap-32";
  }, [columns]);

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
          <Image
            src={`/packs/${
              locale === "en" ? locale + "n" : locale
            }${packImage}`}
            alt="globe"
            width={150}
            height={150}
            className="object-contain"
          />
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
          <Image
            src={`/packs/${
              locale === "en" ? locale + "n" : locale
            }${packImage}`}
            alt="globe"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative pt-6 pb-8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            backgroundPosition: "center",
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
          } relative z-10 mt-6 text-[10px] md:text-[10px] px-4 sm:ps-6 lg:ps-8 `}
        >
          {bullets.map((b, i) => (
            <div key={i} className="mb-1 flex items-center">
              <span className="text-dark-gray font-bold mr-2">
                <Image
                  src={"/star-icon.png"}
                  alt="star icon"
                  width={10}
                  height={10}
                  className="mx-auto "
                />
              </span>
              <span className="text-light-gray">{b}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
