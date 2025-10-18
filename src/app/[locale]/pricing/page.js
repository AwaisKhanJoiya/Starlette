"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import PricingGrid from "@/components/PricingGrid";
import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
import DownloadApp from "@/components/DownloadApp";

const PricingPage = () => {
  const tPackages = useTranslations("packages");
  const section1Cards = [
    {
      id: "p-s1-a",
      price: tPackages("pricingPage.section1.cards.a.price"),
      headline: tPackages("pricingPage.section1.cards.a.headline"),
      gift: tPackages("pricingPage.section1.cards.a.gift"),
      buttonLabel: tPackages("pricingPage.section1.cards.a.button"),
    },
    {
      id: "p-s1-b",
      price: tPackages("pricingPage.section1.cards.b.price"),
      headline: tPackages("pricingPage.section1.cards.b.headline"),
      gift: tPackages("pricingPage.section1.cards.b.gift"),
      buttonLabel: tPackages("pricingPage.section1.cards.b.button"),
    },
  ];
  const section1Bullets = [
    tPackages("pricingPage.section1.bullets.one"),
    tPackages("pricingPage.section1.bullets.two"),
    tPackages("pricingPage.section1.bullets.three"),
  ];

  // Section 2 (another 2 cards)
  const section2Cards = [
    {
      id: "p-s2-a",
      price: tPackages("pricingPage.section2.cards.a.price"),
      headline: tPackages("pricingPage.section2.cards.a.headline"),
      gift: tPackages("pricingPage.section2.cards.a.gift"),
      buttonLabel: tPackages("pricingPage.section2.cards.a.button"),
    },
    {
      id: "p-s2-b",
      price: tPackages("pricingPage.section2.cards.b.price"),
      headline: tPackages("pricingPage.section2.cards.b.headline"),
      gift: tPackages("pricingPage.section2.cards.b.gift"),
      buttonLabel: tPackages("pricingPage.section2.cards.b.button"),
    },
  ];

  // Section 3 (4 cards)
  const section3Cards = [
    {
      id: "p-s3-1",
      slug: tPackages("pricingPage.section3.cards.c1.slug"),
      price: tPackages("pricingPage.section3.cards.c1.price"),
      headline: tPackages("pricingPage.section3.cards.c1.headline"),
      gift: tPackages("pricingPage.section3.cards.c1.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c1.button"),
    },
    {
      id: "p-s3-2",
      slug: tPackages("pricingPage.section3.cards.c2.slug"),
      price: tPackages("pricingPage.section3.cards.c2.price"),
      headline: tPackages("pricingPage.section3.cards.c2.headline"),
      gift: tPackages("pricingPage.section3.cards.c2.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c2.button"),
    },
    {
      id: "p-s3-3",
      slug: tPackages("pricingPage.section3.cards.c3.slug"),
      price: tPackages("pricingPage.section3.cards.c3.price"),
      headline: tPackages("pricingPage.section3.cards.c3.headline"),
      gift: tPackages("pricingPage.section3.cards.c3.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c3.button"),
    },
    {
      id: "p-s3-4",
      slug: tPackages("pricingPage.section3.cards.c4.slug"),
      price: tPackages("pricingPage.section3.cards.c4.price"),
      headline: tPackages("pricingPage.section3.cards.c4.headline"),
      gift: tPackages("pricingPage.section3.cards.c4.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c4.button"),
    },
  ];

  let spaces = 0;

  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:h-screen border-b border-dashed border-black">
        <div className="w-full md:w-1/2  relative z-10 flex flex-col justify-center p-6 md:p-12">
          <div className="mt-10 md:mt-0">
            <h1 className="text-xl md:text-2xl font-bold mb-10 md:mb-20 tracking-[0.5rem] text-center">
              PACKS & MEMBERSHIPS
            </h1>

            {/* Pricing cards: horizontally scroll on mobile, grid on md+ */}
            <div className="hidden md:grid md:grid-cols-3 gap-2 overflow-x-auto md:overflow-visible pb-2">
              {/* Card 1 */}
              <div className="flex-shrink-0 w-12 md:w-32">
                <div className="relative flex justify-center items-center">
                  {/* <h2 className="text-sm md:text-lg font-bold text-[#FABDCE] text-center uppercase"> */}
                  <div className="circular-text-container">
                    <div className="circular-text">
                      {tPackages("packCats.welcome")
                        .split("")
                        .map((char, i) => {
                          if (char === " ") spaces += 1;
                          return (
                            <span
                              key={i}
                              className="text-secondary font-bold text-sm md:text-base origin-[0_80px]"
                              style={{
                                transform: `rotate(${
                                  i *
                                    (360 /
                                      tPackages("packCats.welcome").length -
                                      (16 + spaces)) -
                                  50
                                }deg)`,
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                    </div>
                    {/* </h2> */}
                    <div className="circular-image">
                      <Image
                        src="/welcome-pack.jpg"
                        alt="welcome pack"
                        width={150}
                        height={150}
                        className="object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}

              <div className="flex-shrink-0 w-12 md:w-32">
                <div className="relative flex justify-center items-center">
                  {/* <h2 className="text-sm md:text-lg font-bold text-[#FABDCE] text-center uppercase"> */}
                  <div className="circular-text-container">
                    <div className="circular-text">
                      {tPackages("packCats.classPacks")
                        .split("")
                        .map((char, i) => {
                          if (char === " ") spaces += 1;
                          return (
                            <span
                              key={i}
                              className="text-dark-gray  font-bold text-sm md:text-base origin-[0_80px]"
                              style={{
                                transform: `rotate(${
                                  i *
                                    (360 /
                                      tPackages("packCats.classPacks").length -
                                      (16 + spaces)) -
                                  50
                                }deg)`,
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                    </div>
                    {/* </h2> */}
                    <div className="circular-image">
                      <Image
                        src="/welcome-pack.jpg"
                        alt="welcome pack"
                        width={150}
                        height={150}
                        className="object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}

              <div className="flex-shrink-0 w-12 md:w-32">
                <div className="relative flex justify-center items-center">
                  {/* <h2 className="text-sm md:text-lg font-bold text-[#FABDCE] text-center uppercase"> */}
                  <div className="circular-text-container">
                    <div className="circular-text">
                      {tPackages("packCats.memberships")
                        .split("")
                        .map((char, i) => {
                          if (char === " ") spaces += 1;
                          return (
                            <span
                              key={i}
                              className="text-secondary font-bold text-sm md:text-base origin-[0_80px]"
                              style={{
                                transform: `rotate(${
                                  i *
                                    (360 /
                                      tPackages("packCats.memberships").length -
                                      (16 + spaces)) -
                                  50
                                }deg)`,
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                    </div>
                    {/* </h2> */}
                    <div className="circular-image">
                      <Image
                        src="/welcome-pack.jpg"
                        alt="welcome pack"
                        width={150}
                        height={150}
                        className="object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 ">
            <Image
              src="/pricing.jpg"
              alt="pricing background"
              fill
              className="object-contain "
              priority
            />
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 mb-8 border-b border-dashed border-black">
        <PricingGrid
          cards={section1Cards}
          columns={2}
          bullets={section1Bullets}
          packageName={tPackages("packCats.welcome")}
        />

        {/* 2) second set of 2 cards */}
        <PricingGrid
          cards={section2Cards}
          columns={2}
          bullets={section1Bullets}
          packageName={tPackages("packCats.classPacks")}
        />

        {/* 3) 4 cards */}
        <PricingGrid
          cards={section3Cards}
          columns={4}
          bullets={section1Bullets}
          packageName={tPackages("packCats.memberships")}
        />
        <div className="mb-20"></div>
      </div>
      <div className="bg-white text-dark-gray px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider uppercase">
            {tPackages("scheduleTitle")}
          </h1>
        </div>

        {/* Calendar */}
        <div className="">
          <FitnessBookingCalendar />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-10 pt-4">
        <DownloadApp />
      </div>
    </div>
  );
};

export default PricingPage;
