// components/PricingGrid.jsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import PricingCard from "./PricingCard";
// import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
// import DownloadApp from "@/components/DownloadApp";

export default function PricingGrid({
  cards = [],
  columns = 3,
  backgroundImage = "/light-logo.jpg",
  headerImage = "/welcome-pack.jpg",
  bullets = [],
  packageName,
}) {
  const gridClass = useMemo(() => {
    if (columns === 2)
      return "flex flex-col md:flex-row justify-center items-center gap-8";
    if (columns === 4)
      return "grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center";
    return "flex flex-col md:flex-row justify-center items-center gap-8";
  }, [columns]);

  return (
    <section>
      <div className="px-4 lg:px-8 md:flex hidden flex-col md:flex-row justify-between items-end mb-8 pt-12 ">
        <div className="flex-1 ">
          <div className="space-y-4">
            <div className="h-[2px] mr-4 bg-black"></div>
            <div className="h-[2px] bg-black"></div>
          </div>
        </div>

        <div>
          <h2 className="text-sm md:text-lg font-bold text-dark-gray text-center uppercase">
            {packageName}
          </h2>
          <Image
            src={headerImage}
            alt="globe"
            width={130}
            height={130}
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
          }}
        />

        <div className={`relative z-10 ${gridClass}`}>
          {cards.map((c) => (
            <div key={c.id} className="relative">
              <PricingCard data={c} />
            </div>
          ))}
        </div>
      </div>

      {bullets && bullets.length > 0 && (
        <div className="relative z-10 mt-6 text-xs md:text-sm text-dark-gray px-4 sm:px-6 lg:px-8">
          {bullets.map((b, i) => (
            <div key={i} className="mb-1 flex items-start">
              <span className="text-dark-gray font-bold mr-2">★</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}

      {/* {showCalendar && (
        <div className="px-4 sm:px-6 lg:px-8 pt-12">
          <FitnessBookingCalendar />
        </div>
      )}

      {showDownload && (
        <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <DownloadApp />
        </div>
      )} */}
    </section>
  );
}
