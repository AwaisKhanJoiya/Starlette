"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  py-4 font-arial mt-10">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#000000] font-bold text-center">
          <li className="tracking-widest">{t("links.home")}</li>
          <li className="tracking-widest">{t("links.studio")}</li>
          <li className="tracking-widest">{t("links.method")}</li>
          <li className="tracking-widest">{t("links.pricing")}</li>
          <li className="tracking-widest">{t("links.schedule")}</li>
          <li className="tracking-widest">{t("links.account")}</li>
        </ul>

        {/* Contact */}
        <div className="flex items-center gap-2">
          <Image src="/whatsapp-icon.png" alt="phone" width={24} height={24} />
          <span className="tracking-widest text-[#000000] font-bold">
            {t("contact")}
          </span>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex flex-col items-center sm:items-end gap-1 py-4 text-center sm:text-right">
        <p className="text-black tracking-widest text-xs sm:text-sm">
          {t("email")}
        </p>
        <p className="text-[#000000] tracking-widest font-semibold italic text-xs sm:text-sm">
          {t("rights")}
        </p>
      </div>
    </div>
  );
};

export default Footer;
