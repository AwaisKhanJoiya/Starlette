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
      <div className="bg-background min-h-screen text-dark-gray relative  px-4 sm:px-6 lg:px-8 y-12">
        {/* Section 1 */}
        <section>
          <div className="flex flex-col-reverse md:flex-row items-top md:gap-10 gap-6 pt-12 pb-12">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase">
                {t("section1.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial">
                <p className="text-sm uppercase">
                  {t.rich("section1.body", {
                    b: (chunks) => <span className="font-bold">{chunks}</span>,
                    i: (chunks) => <span className="italic">{chunks}</span>,
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>

            <div className="mx-auto w-full sm:w-64 md:w-1/3">
              <div className="aspect-[4/3] overflow-hidden">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/method-video.mp4" type="video/mp4" />
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
          <div className="flex flex-col-reverse md:flex-row items-center md:gap-10 gap-6 pt-12 md:pt-0 pb-8">
            <div className="w-full md:w-1/2">
              <Image
                src="/micro1.png"
                alt="starlette"
                width={700}
                height={500}
                className="w-full h-auto object-cover rounded"
              />
            </div>

            <div className="w-full md:w-1/2 md:text-right text-left uppercase">
              <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 ">
                {t("section2.title")}
              </h1>

              <div className="space-y-3 leading-relaxed font-arial ">
                <p className="text-sm ">
                  {t.rich("section2.body", {
                    b: (chunks) => <span className="font-bold">{chunks}</span>,
                    i: (chunks) => <span className="italic">{chunks}</span>,
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="pb-6">
          <div className="flex flex-col-reverse md:flex-row md:gap-10 gap-6">
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-bold tracking-[0.6rem] mb-6">
                {t("section3.title")}
              </h1>
              <FitnessBenefits />
            </div>
            <div className="hidden md:block">
              <Image
                src="/choose-lagree.jpg"
                alt="starlette"
                width={500}
                height={100}
                className="w-[28rem] h-full object-cover rounded"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MethodPage;
