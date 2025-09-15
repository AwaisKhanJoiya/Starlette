"use client";

import FitnessBenefits from "@/components/FitnessBenefits";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const MethodPage = () => {
  const t = useTranslations("method");

  return (
    <>
      <div className="min-h-screen text-dark-gray relative  px-4 sm:px-6 lg:px-8 y-12">
        {/* Section 1 */}
        <section>
          <div className="flex flex-col-reverse md:flex-row items-center md:gap-10 gap-6 pt-12 pb-12">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider">
                {t("section1.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm md:text-base tracking-wider font-semibold">
                  {t("section1.line1")}
                </p>
                <p className="text-sm md:text-base tracking-wider font-medium">
                  {t("section1.line2")}
                </p>
                <p className="text-sm md:text-base tracking-wider">
                  {t.rich("section1.line3", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>
                <p className="text-sm md:text-base tracking-wider">
                  <span className="font-semibold">
                    {t("section1.line4.bold1")}
                  </span>
                  <br />
                  {t("section1.line4.afterBold")}
                  <span className="font-semibold">
                    {t("section1.line4.bold2")}
                  </span>{" "}
                  {t("section1.line4.bold2after")}
                </p>

                <p className="text-sm md:text-base tracking-wider font-semibold">
                  {t("section1.line5")}
                </p>
              </div>
            </div>

            <div className="mx-auto w-full sm:w-64 md:w-80">
              <div className="aspect-[4/3] overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/banner-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
            <Button className="md:w-auto w-full rounded-full px-16 py-3 text-sm tracking-wide">
              {t("bookButton")}
            </Button>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="flex flex-col-reverse md:flex-row items-center md:gap-10 gap-6 pt-12 pb-8">
            <div className="w-full md:w-1/2">
              <Image
                src="/micro-delux.jpg"
                alt="starlette"
                width={700}
                height={500}
                className="w-full h-auto object-cover rounded"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider md:text-right text-left">
                {t("section2.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial md:text-right text-left">
                <p className="text-sm md:text-base tracking-wider font-semibold">
                  {t("section2.line1")}
                </p>
                <p className="text-sm md:text-base tracking-wider">
                  {t.rich("section2.line2", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>
                <p className="text-sm md:text-base tracking-wider">
                  {t.rich("section2.line3", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>
                <p className="text-sm md:text-base tracking-wider">
                  {t.rich("section2.line4", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>
                <p className="text-sm md:text-base tracking-wider">
                  {t.rich("section2.line5", {
                    b: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="pb-12">
          <h1 className="text-xl md:text-2xl font-bold tracking-wider mb-6">
            {t("section3.title")}
          </h1>
          <div className="flex flex-col-reverse md:flex-row items-center md:gap-10 gap-6">
            <div className="flex-1">
              <FitnessBenefits />
            </div>
            <div className="hidden md:block">
              <Image
                src="/choose-lagree.jpg"
                alt="starlette"
                width={700}
                height={500}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MethodPage;
