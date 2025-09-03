"use client";

import { useTranslations } from "next-intl";
import AnnoucementBar from "@/components/AnnoucementBar";
import Navbar from "@/components/Navbar";
import BannerVideo from "@/components/BannerVideo";
import Image from "next/image";
import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
import DownloadApp from "@/components/DownloadApp";
import Footer from "@/components/Footer";

export default function StarlightStudio() {
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

              <div className="space-y-3 leading-relaxed font-arial text-right">
                <p className="text-sm tracking-wider">
                  <span className="font-semibold">
                    {t("experience.p1_bold")}
                    <br />
                  </span>
                  <span className="font-semibold">STARLETTE </span>
                  {t("experience.p1_mid")}{" "}
                  <span className="font-semibold">
                    {t("experience.p1_wellness")}
                  </span>{" "}
                  {t("experience.p1_and")}{" "}
                  <span className="font-semibold">
                    {t("experience.p1_power")}
                  </span>{" "}
                  — <br />
                  {t("experience.p1_end")}
                </p>

                <p className="text-sm tracking-wider">
                  {t("experience.p2_intro")}
                  <br />
                  {t("experience.p2_details")}
                </p>
                <p className="text-sm tracking-wider">{t("experience.p3")}</p>
                <p className="text-sm tracking-wider font-semibold">
                  {t("experience.p4")} <br />
                  {t("experience.p4_second")}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* a new way to move  */}
        <section>
          <div className="flex items-end justify-between py-12 px-8">
            <div className="flex-1 ">
              <h1 className="text-2xl font-bold mb-8 tracking-wider">
                {t("newway.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial ">
                <p className="text-sm tracking-wider">
                  {t("newway.p1_part1")}{" "}
                  <span className="font-semibold">LAGREE</span> :{" "}
                  {t("newway.p1_part2")}
                  <br />
                  {t("newway.p1_extra")}
                </p>

                <p className="text-sm tracking-wider">
                  <span className="font-semibold">{t("newway.short")}</span> ,
                  <span className="font-semibold"> {t("newway.intense")}</span>{" "}
                  , AND
                  <span className="font-semibold">
                    {" "}
                    {t("newway.lowimpact")}{" "}
                  </span>
                  {t("newway.p2_end")}
                </p>

                <p className="text-sm  tracking-wider">{t("newway.p3")}</p>

                <p className="text-sm font-semibold tracking-wider">
                  {t("newway.p4")}
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-8 items-center md:pe-12 pe-0">
              <button className="bg-primary w-full  text-black  px-8 py-3 rounded-full text-sm tracking-wide transition-colors">
                {t("buttons.theStudio")}
              </button>
              <button className="bg-primary w-full  text-black  px-8 py-3 rounded-full text-sm tracking-wide transition-colors">
                {t("buttons.theMethod")}
              </button>
              <button className="bg-primary w-full  text-black  px-8 py-3 rounded-full text-sm tracking-wide transition-colors">
                {t("buttons.memberships")}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-8 px-8 pt-12">
            <div className="flex-1">
              <div className="space-y-4 ">
                <div className="h-[2px] mr-4 bg-black"></div>
                <div className="h-[2px] bg-black"></div>
              </div>
            </div>

            <div className="">
              <Image
                src="/welcome-pack.jpg"
                alt="globe"
                width={130}
                height={130}
              />
            </div>
          </div>

          <div className="relative pt-6 pb-8 ">
            <div
              className="absolute inset-0 "
              style={{
                backgroundImage: 'url("/light-logo.jpg")',
                backgroundRepeat: "repeat",
                backgroundSize: "60px 60px",
              }}
            ></div>

            <div className="relative z-10 flex justify-center gap-16 ">
              <div className="relative ">
                <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-60 text-center shadow-sm">
                  <div className="text-5xl font-bold  mb-2">
                    {t("pricing.oneClassPrice")}
                  </div>
                  <div className="text-3xl font-bold mb-2">★</div>
                  <div className="text-xl trea font-semibold mb-2 tracking-wider">
                    {t("pricing.oneClassText")}
                  </div>
                  <div className="text-xs  mb-6">{t("pricing.gift")}</div>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <button className="bg-secondary border border-black  text-black  py-2 px-8 rounded shadow-md">
                    {t("pricing.book")}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-60 text-center shadow-sm">
                  <div className="text-5xl font-bold  mb-2">
                    {t("pricing.threeClassPrice")}
                  </div>
                  <div className="text-3xl font-bold mb-2">★</div>
                  <div className="text-xl trea font-semibold mb-2 tracking-wider">
                    {t("pricing.threeClassText")}
                  </div>
                  <div className="text-xs  mb-6">{t("pricing.gift")}</div>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <button className="bg-secondary border border-black  text-black  py-2 px-8 rounded shadow-md">
                    {t("pricing.book")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-2 text-xs text-black px-8 ">
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
          <div className="px-8 pt-12">
            <FitnessBookingCalendar />
          </div>
          <div className="px-8 pt-12 pb-10">
            <DownloadApp />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
