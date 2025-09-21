"use client";

import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
    const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <div
      className={`${
        locale === "he" ? "rtl" : ""
      }  px-4 sm:px-6 lg:px-8  py-4 font-arial mt-10`}
    >
      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-dark-gray font-bold text-center">
          <li>{t("links.home")}</li>
          <li>{t("links.studio")}</li>
          <li>{t("links.method")}</li>
          <li>{t("links.pricing")}</li>
          <li>{t("links.schedule")}</li>
          <li>{t("links.account")}</li>
        </ul>

        {/* Contact */}
        <div className="flex items-center gap-2">
          <Image src="/whatsapp-icon.png" alt="phone" width={24} height={24} />
          <span className="text-dark-gray font-bold">{t("contact")}</span>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex flex-col items-center sm:items-end gap-1   text-center sm:text-right">
        <p className="text-dark-gray text-xs sm:text-sm">{t("email")}</p>
        <p className="text-dark-gray font-semibold italic text-xs sm:text-sm">
          {t("rights")}
        </p>
      </div>
    </div>
  );
};

export default Footer;
