"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { useTranslations } from "next-intl";

const StudioPage = () => {
  const t = useTranslations("studio");

  return (
    <>
      <div className="min-h-screen bg-white text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider">
              {t("header.title")}
            </h1>

            <div className="space-y-3 leading-relaxed font-arial uppercase">
              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p1", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>

              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p2", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>

              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p3", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>

              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p4", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>

              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p5", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>

              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p6", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>

              <p className="text-sm md:text-base tracking-wider">
                {t.rich("header.p7", {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider">
              {t("location.title")}
            </h1>

            <div className="text-sm text-gray-600 mb-6">
              <p className="font-medium">{t("location.address1")}</p>
              <p>{t("location.address2")}</p>
            </div>
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
              className="grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudioPage;
