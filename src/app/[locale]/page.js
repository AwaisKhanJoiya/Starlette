"use client";

import { useLocale, useTranslations } from "next-intl";
import AnnoucementBar from "@/components/AnnoucementBar";
import BannerVideo from "@/components/BannerVideo";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PricingGrid from "@/components/PricingGrid";
import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
import DownloadApp from "@/components/DownloadApp";

export default function StarletteStudio({ params }) {
  const locale = useLocale();

  const t = useTranslations("home");
  const tPackages = useTranslations("packages");
  const cards = [
    {
      id: "home-one",
      price: tPackages("home.cards.one.price"),
      headline: tPackages("home.cards.one.headline"),
      gift: tPackages("home.cards.one.gift"),
      buttonLabel: tPackages("home.cards.one.button"),
    },
    {
      id: "home-three",
      price: tPackages("home.cards.three.price"),
      headline: tPackages("home.cards.three.headline"),
      gift: tPackages("home.cards.three.gift"),
      buttonLabel: tPackages("home.cards.three.button"),
    },
  ];

  const bullets = [
    tPackages("home.bullets.one"),
    tPackages("home.bullets.two"),
    tPackages("home.bullets.three"),
  ];
  return (
    <div className="min-h-screen mx-auto text-white relative bg-white">
      {/* Hero video area */}
      <main className="flex items-center justify-center relative">
        <div className="text-center w-full">
          <div className="relative w-full">
            <BannerVideo />
          </div>
        </div>
      </main>

      <main className="font-arial text-dark-gray">
        <section>
          <AnnoucementBar />

          {/* HERO: keep design but make responsive */}
          <div
            className={`${
              locale === "he" ? "rtl" : ""
            } flex px-4 sm:px-6 lg:px-8 flex-col md:flex-row items-center md:items-end justify-between gap-8 py-12`}
          >
            <div className="w-full md:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase">
                {t("hero.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm uppercase">
                  {t.rich("hero.body", {
                    b: (chunks) => <span className="font-bold">{chunks}</span>,
                    i: (chunks) => <span className="italic">{chunks}</span>,
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center md:items-end gap-4">
              <div className="flex flex-col items-center">
                <div className="mb-0 hidden md:block">
                  <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="starlette"
                      width={1000}
                      height={1000}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* CTA - using shadcn Button to keep consistent UI */}
                <Button className="rounded-full px-6 md:px-8 py-3 text-sm w-full md:w-auto">
                  {t("hero.cta")}
                </Button>
              </div>
            </div>
          </div>

          <AnnoucementBar />
        </section>

        {/* Experience section - responsive */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row md:items-start items-center pt-12 border-b border-dashed border-black">
            <div className="w-full md:w-1/2 pt-20">
              <Image
                src="/starlette-exprience.png"
                alt="starlette"
                width={700}
                height={500}
                style={{
                  transform: "rotateY(180deg) rotateZ(-3deg)",
                  filter: "drop-shadow(-1px -1px 13px #545454)",
                }}
                className="w-full h-auto object-cover rounded"
              />
            </div>

            <div className="w-full md:w-1/2  md:text-right text-left">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase">
                {t("experience.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm uppercase">
                  {t.rich("experience.body", {
                    b: (chunks) => <span className="font-bold">{chunks}</span>,
                    i: (chunks) => <span className="italic">{chunks}</span>,
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New way to move section */}
        <section
          className={`${locale === "he" ? "rtl" : ""}  px-4 sm:px-6 lg:px-8 `}
        >
          <div className="flex flex-col md:flex-row items-center justify-between  gap-8 pt-10">
            <div className="w-full md:w-1/2  ">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase">
                {t("hero.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm uppercase">
                  {t.rich("newway.body", {
                    b: (chunks) => <span className="font-bold">{chunks}</span>,
                    i: (chunks) => <span className="italic">{chunks}</span>,
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-end space-y-8">
              <div className="w-full md:w-2/3 flex justify-end items-stretch">
                <Button className="md:w-72 w-full rounded-full px-6 py-3 text-sm">
                  {t("buttons.theStudio")}
                </Button>
              </div>

              <div className="w-full md:w-2/3 flex justify-end items-stretch">
                <Button className="md:w-72 w-full rounded-full px-6 py-3 text-sm">
                  {t("buttons.theMethod")}
                </Button>
              </div>

              <div className="w-full md:w-2/3 flex justify-end items-stretch">
                <Button className=" md:w-72 w-full rounded-full px-6 py-3 text-sm">
                  {t("buttons.memberships")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing + booking */}
        <PricingGrid
          cards={cards}
          columns={2}
          bullets={bullets}
          packageName={"WELCOME PACK"}
        />
        <div className="px-4 sm:px-6 lg:px-8 pt-12">
          <FitnessBookingCalendar />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <DownloadApp />
        </div>
      </main>
    </div>
  );
}
