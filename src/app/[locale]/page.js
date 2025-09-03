"use client";

import { useTranslations } from "next-intl";
import AnnoucementBar from "@/components/AnnoucementBar";
import Navbar from "@/components/Navbar";
import BannerVideo from "@/components/BannerVideo";
import Image from "next/image";
import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
import DownloadApp from "@/components/DownloadApp";
import Footer from "@/components/Footer";

export default function StarlightStudio({ params }) {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen  mx-auto text-white relative overflow-hidden">
      <Navbar />
      <main className="flex items-center justify-center  relative">
        <div className="text-center w-full ">
          <div className="relative w-full">
            <BannerVideo />
          </div>
        </div>
      </main>
      <main className=" bg-white  font-arial text-black container mx-auto">
        <section>
          <AnnoucementBar />

          <div className="flex items-end justify-between py-12 px-8">
            <div className="flex-1 ">
              <h1 className="text-2xl font-bold mb-8 tracking-wider">
                {t("hero.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial ">
                <p className="text-sm tracking-wider">
                  <span className="font-semibold">STARLETTE</span>{" "}
                  {t("hero.p1_line1")} <br />
                  {t("hero.p1_line2")}
                </p>

                <p className="text-sm tracking-wider">
                  {t("hero.p2_line1")}
                  <br />
                  {t("hero.p2_line2")}
                  <br />
                  <span className="font-semibold">
                    {t("hero.p2_highlight")}
                  </span>
                </p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("hero.more")}
                </p>

                <p className="text-sm italic tracking-wider">
                  {t("hero.italic")}
                </p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("hero.ready")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center md:pe-12 pe-0">
              <div className="mb-4">
                <div className="w-56 h-56   flex items-center justify-center">
                  <Image
                    src="/logo.jpg"
                    alt="starlette"
                    width={1000}
                    height={1000}
                  />
                </div>
              </div>

              <button className="bg-primary  text-black  px-8 py-3 rounded-full text-sm tracking-wide transition-colors">
                {t("hero.cta")}
              </button>
            </div>
          </div>
          <AnnoucementBar />
        </section>
        {/* the starlette expirience */}
        <section>
          <div className="flex align-items-center  justify-between md:gap-10 gap-0 pt-12 px-8 border-b border-dashed border-black">
            <div className="flex flex-1  ">
              <Image
                src="/starlette-exprience.jpg"
                alt="starlette"
                width={700}
                height={500}
              />
            </div>
            <div className="">
              <h1 className="text-2xl font-bold mb-8 tracking-wider text-right">
                {t("experience.title")}
              </h1>

              <div className="space-y-3 leading-relaxed text-right">
                <p className="text-sm">
                  <span className="font-semibold">
                    {t("experience.p1_bold")}
                  </span>{" "}
                  <br />
                  STARLETTE {t("experience.p1_mid")}{" "}
                  <span className="font-semibold">
                    {t("experience.p1_wellness")}
                  </span>{" "}
                  {t("experience.p1_and")}{" "}
                  <span className="font-semibold">
                    {t("experience.p1_power")}
                  </span>{" "}
                  {t("experience.p1_end")}
                </p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("experience.p2_intro")}
                </p>
                <p className="text-sm  tracking-wider">
                  {t("experience.p2_details")}
                </p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("experience.p3")}
                </p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("experience.p4")}
                </p>
                <p className="text-sm italic tracking-wider">
                  {t("experience.p4_second")}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* a new way to move */}
        <section>
          <div className="flex align-items-center  justify-between md:gap-10 gap-0 pt-12 px-8 border-b border-dashed border-black">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-8 tracking-wider">
                {t("newway.title")}
              </h1>

              <div className="space-y-3 leading-relaxed">
                <p className="text-sm">
                  <span className="font-semibold">{t("newway.p1_part1")}</span>{" "}
                  {t("newway.p1_part2")} {t("newway.p1_extra")}
                </p>

                <div className="flex items-center">
                  <div className="border border-black rounded-full px-6 py-3 text-xs font-semibold">
                    {t("newway.short")}
                  </div>
                  <div className="border border-black rounded-full px-6 py-3 text-xs font-semibold mx-4">
                    {t("newway.intense")}
                  </div>
                  <div className="border border-black rounded-full px-6 py-3 text-xs font-semibold">
                    {t("newway.lowimpact")}
                  </div>
                </div>

                <p className="text-sm font-semibold tracking-wider">
                  {t("newway.p2_end")}
                </p>
                <p className="text-sm  tracking-wider">{t("newway.p3")}</p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("newway.p4")}
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <Image
                src="/exprience.jpg"
                alt="starlette"
                width={700}
                height={500}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 py-8">
            <button className="bg-white text-black border border-black px-8 py-3 rounded-full text-xs font-semibold">
              {t("buttons.theStudio")}
            </button>
            <button className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold">
              {t("buttons.theMethod")}
            </button>
            <button className="bg-white text-black border border-black px-8 py-3 rounded-full text-xs font-semibold">
              {t("buttons.memberships")}
            </button>
          </div>

          {/*  fitness booking calendar */}
          <FitnessBookingCalendar />

          {/* welcome pack */}
          <section className="py-12 px-8">
            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <div className="w-full rounded-xl overflow-hidden">
                    <Image
                      src="/welcome-pack.jpg"
                      alt="Welcome Pack"
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold mb-4 tracking-wider">
                    WELCOME PACK
                  </h2>
                  <div className="space-y-4">
                    <p className="text-sm tracking-wider">
                      <span className="text-lg font-bold">
                        {t("pricing.oneClassPrice")}
                      </span>{" "}
                      - {t("pricing.oneClassText")}
                    </p>
                    <p className="text-sm tracking-wider">
                      <span className="text-lg font-bold">
                        {t("pricing.threeClassPrice")}
                      </span>{" "}
                      - {t("pricing.threeClassText")}
                      <br />
                      {t("pricing.gift")}
                    </p>
                    <button className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold mt-4">
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
      <DownloadApp />
      <Footer />
    </div>
  );
}
