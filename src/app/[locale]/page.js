"use client";

import { useTranslations } from "next-intl";
import AnnoucementBar from "@/components/AnnoucementBar";
import Navbar from "@/components/Navbar";
import BannerVideo from "@/components/BannerVideo";
import Image from "next/image";
import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
import DownloadApp from "@/components/DownloadApp";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function StarletteStudio({ params }) {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen mx-auto text-white relative">
      <Navbar />

      {/* Hero video area */}
      <main className="flex items-center justify-center relative">
        <div className="text-center w-full">
          <div className="relative w-full">
            <BannerVideo />
          </div>
        </div>
      </main>

      <main className="bg-white font-arial text-black max-w-7xl mx-auto ">
        <section>
          <AnnoucementBar />

          {/* HERO: keep design but make responsive */}
          <div className="flex px-4 sm:px-6 lg:px-8 flex-col md:flex-row items-center md:items-end justify-between gap-8 py-12">
            <div className="w-full md:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider">
                {t("hero.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm md:text-base tracking-wider">
                  <span className="font-semibold">STARLETTE</span>{" "}
                  {t("hero.p1_line1")}
                  <br />
                  {t("hero.p1_line2")}
                </p>

                <p className="text-sm md:text-base tracking-wider">
                  {t("hero.p2_line1")}
                  {t("hero.p2_line2")}
                  <span className="font-semibold">
                    {t("hero.p2_highlight")}
                  </span>
                </p>

                <p className="text-sm md:text-base font-semibold tracking-wider">
                  {t("hero.more")}
                </p>

                <p className="text-sm md:text-base italic tracking-wider">
                  {t("hero.italic")}
                </p>

                <p className="text-sm md:text-base font-semibold tracking-wider">
                  {t("hero.ready")}
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center md:items-end gap-4">
              <div className="mb-0 hidden md:block">
                <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                  <Image
                    src="/logo.jpg"
                    alt="starlette"
                    width={1000}
                    height={1000}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* CTA - using shadcn Button to keep consistent UI */}
              <Button className="rounded-full px-6 md:px-8 py-3 text-sm tracking-wide w-full md:w-auto">
                {t("hero.cta")}
              </Button>
            </div>
          </div>

          <AnnoucementBar />
        </section>

        {/* Experience section - responsive */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center md:gap-10 gap-6 pt-12 border-b border-dashed border-black pb-8">
            <div className="w-full md:w-1/2">
              <Image
                src="/starlette-exprience.jpg"
                alt="starlette"
                width={700}
                height={500}
                className="w-full h-auto object-cover rounded"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider md:text-right text-left">
                {t("experience.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial md:text-right text-left">
                <p className="text-sm md:text-base tracking-wider">
                  <span className="font-semibold">
                    {t("experience.p1_bold")}
                  </span>
                  <br />
                  <span className="font-semibold">STARLETTE </span>
                  {t("experience.p1_mid")}{" "}
                  <span className="font-semibold">
                    {t("experience.p1_wellness")}
                  </span>{" "}
                  {t("experience.p1_and")}{" "}
                  <span className="font-semibold">
                    {t("experience.p1_power")}
                  </span>
                  —
                  <br />
                  {t("experience.p1_end")}
                </p>

                <p className="text-sm md:text-base tracking-wider">
                  {t("experience.p2_intro")}
                  <br />
                  {t.rich("experience.p2_details1", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                  <br />
                  {t.rich("experience.p2_details2", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                  <br />
                  {t.rich("experience.p2_details3", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                  <br />
                  {t.rich("experience.p2_details4", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>

                <p className="text-sm md:text-base tracking-wider">
                  {t("experience.p3")}
                  <br />
                  {t("experience.p3_second")}
                </p>

                <p className="text-sm md:text-base tracking-wider font-semibold">
                  {t("experience.p4")}
                  <br />
                  {t("experience.p4_second")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New way to move section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end md:items-end justify-between py-12 gap-8">
            <div className="w-full md:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider">
                {t("newway.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm md:text-base tracking-wider">
                  {t("newway.p1_part1")}{" "}
                  <span className="font-semibold">LAGREE</span> :{" "}
                  {t("newway.p1_part2")}
                  <br />
                  {t("newway.p1_extra")}
                </p>

                <p className="text-sm md:text-base tracking-wider">
                  {" "}
                  <span className="font-semibold">
                    {t("newway.short")}
                  </span>,{" "}
                  <span className="font-semibold">{t("newway.intense")}</span>,
                  AND{" "}
                  <span className="font-semibold">{t("newway.lowimpact")}</span>{" "}
                  {t("newway.p2_end")}
                </p>

                <p className="text-sm md:text-base tracking-wider">
                  {t("newway.p3")}
                </p>

                <p className="text-sm md:text-base font-semibold tracking-wider">
                  {t("newway.p4")}
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center md:items-end space-y-8">
              <div className="w-full md:w-2/3 flex justify-end items-stretch">
                <Button className="md:w-[60%] w-full rounded-full px-6 py-3 text-sm tracking-wide">
                  {t("buttons.theStudio")}
                </Button>
              </div>

              <div className="w-full md:w-2/3 flex justify-end items-stretch">
                <Button className="md:w-[60%] w-full rounded-full px-6 py-3 text-sm tracking-wide">
                  {t("buttons.theMethod")}
                </Button>
              </div>

              <div className="w-full md:w-2/3 flex justify-end items-stretch">
                <Button className=" md:w-[60%] w-full rounded-full px-6 py-3 text-sm tracking-wide">
                  {t("buttons.memberships")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing + booking */}
        <section>
          <div className="px-4  lg:px-8 md:flex hidden flex-col md:flex-row justify-between items-end mb-8 pt-12 ">
            <div className="flex-1 ">
              <div className="space-y-4">
                <div className="h-[2px] mr-4 bg-black"></div>
                <div className="h-[2px] bg-black"></div>
              </div>
            </div>

            <div>
              <Image
                src="/welcome-pack.jpg"
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
                backgroundImage: 'url("/light-logo.jpg")',
                backgroundRepeat: "repeat",
                backgroundSize: "60px 60px",
              }}
            ></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="relative">
                <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-56 md:w-60 text-center shadow-sm">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {t("pricing.oneClassPrice")}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-2">★</div>
                  <div className="text-lg md:text-xl trea font-semibold mb-2 tracking-wider">
                    {t("pricing.oneClassText")}
                  </div>
                  <div className="text-xs md:text-sm mb-6">
                    {t("pricing.gift")}
                  </div>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <Button className="bg-secondary border border-black text-black py-2 px-6 rounded shadow-md">
                    {t("pricing.book")}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-56 md:w-60 text-center shadow-sm">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {t("pricing.threeClassPrice")}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-2">★</div>
                  <div className="text-lg md:text-xl trea font-semibold mb-2 tracking-wider">
                    {t("pricing.threeClassText")}
                  </div>
                  <div className="text-xs md:text-sm mb-6">
                    {t("pricing.gift")}
                  </div>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <Button className="bg-secondary border border-black text-black py-2 px-6 rounded shadow-md">
                    {t("pricing.book")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 text-xs md:text-sm text-black px-4 sm:px-6 lg:px-8">
            <div className="mb-1 flex items-start">
              <span className="text-black font-bold mr-2">★</span>
              <span>{t("bullets.one")}</span>
            </div>
            <div className="mb-1 flex items-start">
              <span className="text-black font-bold mr-2">★</span>
              <span>{t("bullets.two")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-black font-bold mr-2">★</span>
              <span>{t("bullets.three")}</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pt-12">
            <FitnessBookingCalendar />
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-10">
            <DownloadApp />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
