"use client";

import React from "react";
import Image from "next/image";
import { InstagramIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const DownloadApp = () => {
  const t = useTranslations("downloadApp");

  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:gap-10 gap-6">
      {/* Left image (hidden on small screens) */}
      <div className="hidden md:flex w-1/2 justify-center relative">
        {/* Circle background */}
        <div className="absolute w-96 h-96 bg-primary rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Image on top */}
        <Image
          src="/app-store.jpg"
          alt="starlette"
          width={250}
          height={150}
          className="relative z-10 border-8 border-[#000] rounded-2xl"
        />
      </div>

      {/* Right content */}
      <div className="flex flex-col md:w-1/2 w-full items-center md:items-end text-center md:text-right">
        <h1 className="text-2xl font-bold mb-4 tracking-wider">{t("title")}</h1>

        <div className="leading-relaxed font-arial">
          <p className="text-sm tracking-wider">
            {t.rich("body", {
              b: (chunks) => <span className="font-bold">{chunks}</span>,
              br: () => <br />,
            })}
          </p>

          {/* App Download Image */}
          <div className="flex justify-center md:justify-end gap-4 mt-6">
            <Image
              src="/google-app.jpg"
              alt="starlette"
              width={280}
              height={280}
            />
          </div>

          {/* Social Title */}
          <p className="font-medium tracking-wider my-2 text-base">
            {t("socialTitle")}
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-4 mt-2">
            <InstagramIcon color="black" size={30} />
            <Image src="/tiktok.png" alt="starlette" width={30} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
