// components/PricingGrid.jsx
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
  backgroundImage = "/light-logo.jpg",
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
      <style jsx>{`
        .circular-text-container {
          position: relative;
          // width: 150px;
          // height: 150px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
        }

        .circular-text {
          position: absolute;
          // width: 100%;
          // height: 100%;
          top: -20px;
          border-radius: 50%;
          // animation: rotate 25s linear infinite;
        }

        .circular-text span {
          position: absolute;
          top: 0;
          left: 50%;
          transform-origin: 0 75px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .circular-image {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          z-index: 2;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="px-4 lg:px-8 md:flex hidden flex-col md:flex-row justify-between items-end mb-8 pt-12">
        <div className="flex-1">
          <div className="space-y-4">
            <div className="h-[2px] mr-4 bg-dark-gray"></div>
            <div className="h-[2px] bg-dark-gray"></div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="circular-text-container">
            <div className="circular-text">
              {t("pricing.globeText")
                .split("")
                .map((char, i) => {
                  if (char === " ") spaces += 1;
                  return (
                    <span
                      key={i}
                      className="text-dark-gray font-bold text-sm md:text-base"
                      style={{
                        transform: `rotate(${
                          i *
                            (360 / t("pricing.globeText").length -
                              (18 + spaces * 1)) -
                          50
                        }deg)`,
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
            </div>
            <div className="circular-image">
              <Image
                src={headerImage}
                alt="globe"
                width={110}
                height={110}
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
                  className="text-dark-gray font-bold text-sm"
                  style={{
                    transform: `rotate(${i * (360 / packageName.length)}deg)`,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="circular-image">
              <Image
                src={headerImage}
                alt="globe"
                width={90}
                height={90}
                className="object-contain rounded-full"
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
            <div key={c.id} className="relative">
              <PricingCard data={c} />
            </div>
          ))}
        </div>
      </div>

      {bullets && bullets.length > 0 && (
        <div
          className={`${
            locale === "he" && "rtl"
          } relative z-10 mt-6 text-xs md:text-sm text-dark-gray px-4 sm:px-6 lg:px-8`}
        >
          {bullets.map((b, i) => (
            <div key={i} className="mb-1 flex items-start">
              <span className="text-dark-gray font-bold mr-2">★</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
