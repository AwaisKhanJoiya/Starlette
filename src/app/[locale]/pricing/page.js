"use client";

import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import PricingGrid from "@/components/PricingGrid";
import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
// import DownloadApp from "@/components/DownloadApp";
import Link from "next/link";

const PricingPage = () => {
  const locale = useLocale();
  const tPackages = useTranslations("packages");
  const section1Cards = [
    {
      id: "p-s1-a",
      price: tPackages("pricingPage.section1.cards.a.price"),
      headline: tPackages("pricingPage.section1.cards.a.headline"),
      // gift: tPackages("pricingPage.section1.cards.a.gift"),
      buttonLabel: tPackages("pricingPage.section1.cards.a.button"),
      validity: tPackages("pricingPage.section1.cards.a.validity"),
    },
    {
      id: "p-s1-b",
      price: tPackages("pricingPage.section1.cards.b.price"),
      headline: tPackages("pricingPage.section1.cards.b.headline"),
      gift: tPackages("pricingPage.section1.cards.b.gift"),
      buttonLabel: tPackages("pricingPage.section1.cards.b.button"),
      validity: tPackages("pricingPage.section1.cards.b.validity"),
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
      validity: tPackages("pricingPage.section2.cards.a.validity"),
    },
    {
      id: "p-s2-b",
      price: tPackages("pricingPage.section2.cards.b.price"),
      headline: tPackages("pricingPage.section2.cards.b.headline"),
      gift: tPackages("pricingPage.section2.cards.b.gift"),
      buttonLabel: tPackages("pricingPage.section2.cards.b.button"),
      validity: tPackages("pricingPage.section2.cards.b.validity"),
    },
  ];

  const section2Bullets = [
    tPackages("pricingPage.section2.bullets.one"),
    tPackages("pricingPage.section2.bullets.two"),
    tPackages("pricingPage.section2.bullets.three"),
  ];

  // Section 3 (4 cards)
  const section3Cards = [
    {
      id: "p-s3-1",
      slug: tPackages("pricingPage.section3.cards.c1.slug"),
      price: tPackages("pricingPage.section3.cards.c1.price"),
      // headline: tPackages("pricingPage.section3.cards.c1.headline"),
      headline: tPackages.rich("pricingPage.section3.cards.c1.headline", {
        br: () => <br />,
      }),
      gift: tPackages("pricingPage.section3.cards.c1.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c1.button"),
      validity: tPackages("pricingPage.section3.cards.c1.validity"),
    },
    {
      id: "p-s3-2",
      slug: tPackages("pricingPage.section3.cards.c2.slug"),
      price: tPackages("pricingPage.section3.cards.c2.price"),
      // headline: tPackages("pricingPage.section3.cards.c2.headline"),
      headline: tPackages.rich("pricingPage.section3.cards.c2.headline", {
        br: () => <br />,
      }),
      gift: tPackages("pricingPage.section3.cards.c2.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c2.button"),
      validity: tPackages("pricingPage.section3.cards.c2.validity"),
    },
    {
      id: "p-s3-3",
      slug: tPackages("pricingPage.section3.cards.c3.slug"),
      price: tPackages("pricingPage.section3.cards.c3.price"),
      // headline: tPackages("pricingPage.section3.cards.c3.headline"),
      headline: tPackages.rich("pricingPage.section3.cards.c3.headline", {
        br: () => <br />,
      }),
      gift: tPackages("pricingPage.section3.cards.c3.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c3.button"),
      validity: tPackages("pricingPage.section3.cards.c3.validity"),
    },
    {
      id: "p-s3-4",
      slug: tPackages("pricingPage.section3.cards.c4.slug"),
      price: tPackages("pricingPage.section3.cards.c4.price"),
      // headline: tPackages("pricingPage.section3.cards.c4.headline"),
      headline: tPackages.rich("pricingPage.section3.cards.c4.headline", {
        br: () => <br />,
      }),
      gift: tPackages("pricingPage.section3.cards.c4.gift"),
      buttonLabel: tPackages("pricingPage.section3.cards.c4.button"),
      validity: tPackages("pricingPage.section3.cards.c4.validity"),
    },
  ];

  const section3Bullets = [
    tPackages("pricingPage.section3.bullets.one"),
    tPackages("pricingPage.section3.bullets.two"),
    tPackages("pricingPage.section3.bullets.three"),
  ];

  return (
    <div className="bg-background">
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:h-screen border-b border-dashed border-black">
        <div className="w-full md:w-1/2  relative z-10 flex flex-col justify-center p-6 md:p-12">
          <div className="mt-10 md:mt-0">
            <h1 className="text-xl md:text-2xl font-bold mb-10 md:mb-20 tracking-[0.5rem] text-center">
              {tPackages("title").toUpperCase()}
            </h1>

            {/* Pricing cards: horizontally scroll on mobile, grid on md+ */}
            <div className="hidden md:grid md:grid-cols-3 gap-2 overflow-x-auto md:overflow-visible pb-2">
              {/* Card 1 */}
              <div className="flex-shrink flex justify-center items-center">
                <Link href={"#welcome-pack"}>
                  <div className="relative w-12 md:w-32">
                    <Image
                      src={`/packs/${
                        locale === "en" ? locale + "n" : locale
                      }/welcome-pack.png`}
                      alt="globe"
                      width={150}
                      height={150}
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              {/* Card 2 */}

              <div className="flex-shrink flex justify-center items-center">
                <Link href={"#class-packs"}>
                  <div className="relative w-12 md:w-32">
                    <Image
                      src={`/packs/${
                        locale === "en" ? locale + "n" : locale
                      }/class-packs.png`}
                      alt="globe"
                      width={150}
                      height={150}
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              {/* Card 3 */}

              <div className="flex-shrink flex justify-center items-center">
                <Link href={"#memberships"}>
                  <div className="relative w-12 md:w-32">
                    <Image
                      src={`/packs/${
                        locale === "en" ? locale + "n" : locale
                      }/memberships.png`}
                      alt="globe"
                      width={150}
                      height={150}
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 ">
            <Image
              src="/pricing.png"
              alt="pricing background"
              fill
              className="object-contain "
              priority
            />
          </div>
        </div>
      </div>
      <div className="mb-8 border-b border-dashed border-black">
        <div id="welcome-pack">
          <PricingGrid
            cards={section1Cards}
            columns={2}
            bullets={section1Bullets}
            packageName={tPackages("packCats.welcome")}
            packImage="/welcome-pack.png"
          />
        </div>

        {/* 2) second set of 2 cards */}
        <div id="class-packs">
          <PricingGrid
            cards={section2Cards}
            columns={2}
            bullets={section2Bullets}
            packageName={tPackages("packCats.classPacks")}
            packImage="/class-packs.png"
          />
        </div>

        {/* 3) 4 cards */}
        <div id="memberships">
          <PricingGrid
            cards={section3Cards}
            columns={4}
            bullets={section3Bullets}
            packageName={tPackages("packCats.memberships")}
            packImage="/memberships.png"
          />
        </div>

        <div className="mb-20"></div>
      </div>
      <div className="bg-background text-dark-gray px-4 sm:px-6 lg:px-8">
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

      {/* <div className="px-4 sm:px-6 lg:px-8 pb-10 pt-4">
        <DownloadApp />
      </div> */}
    </div>
  );
};

export default PricingPage;
