"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StudioPage = () => {
  const locale = useLocale();
  const t = useTranslations("studio");

  return (
    <>
      <div
        style={
          locale === "en"
            ? { backgroundImage: "url('/studio-bg.png')" }
            : undefined
        }
        className={`${
          locale === "he" ? "rtl" : ""
        } min-h-screen bg-background bg-cover bg-center bg-no-repeat  text-dark-gray px-4 sm:px-6 lg:px-8 py-16`}
      >
        <div className="space-y-20 md:space-y-80">
          {/* Header Section */}
          <div className="">
            <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase">
              {t("header.title")}
            </h1>

            <div className="space-y-3 leading-relaxed font-arial">
              <p className="text-sm uppercase">
                {t.rich("header.body", {
                  b: (chunks) => <span className="font-bold">{chunks}</span>,
                  i: (chunks) => <span className="italic">{chunks}</span>,
                  br: () => <br />,
                })}
              </p>
            </div>
            <Link href="/pricing">
              <Button className="mt-8 bg-primary text-dark-gray uppercase px-10 rounded-full">
                Book a Class 
              </Button>
            </Link>
          </div>

          {/* Location Section */}
          <div className=" bg-background p-4 rounded-3xl">
            <h1 className="text-xl  font-bold mb-2 tracking-widest uppercase text-dark-gray">
              {t("location.title")}
            </h1>

            <div className="text-[12px] text-gray-600 mb-6 leading-tight">
              <p className="font-medium">{t("location.address1")}</p>
              <p>{t("location.address2")}</p>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-96 overflow-hidden ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.7878654321!2d34.7651538!3d32.0699771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4db7b434aca7%3A0x8d5a40c17e6a8773!2sStarlette!5e0!3m2!1sen!2s!4v1693580000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudioPage;
