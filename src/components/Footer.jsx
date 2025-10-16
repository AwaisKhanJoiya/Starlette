"use client";

import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Footer = () => {
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <div
      className={`${
        locale === "he" ? "rtl" : ""
      } px-4 sm:px-6 lg:px-8 py-6 bg-white font-arial`}
    >
      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-dark-gray font-bold text-center">
          <Link href="/">
            <li>{t("links.home")}</li>
          </Link>
          <Link href="/studio">
            <li>{t("links.studio")}</li>
          </Link>
          <Link href="/method">
            <li>{t("links.method")}</li>
          </Link>
          <Link href="/pricing">
            <li>{t("links.pricing")}</li>
          </Link>
          <Link href="/schedule">
            <li>{t("links.schedule")}</li>
          </Link>
          {user && (
            <Link href="/account">
              <li>{t("links.account")}</li>
            </Link>
          )}
        </ul>

        {/* Contact */}
        <div
          dir={locale === "he" ? "ltr" : "rtl"}
          className="flex items-center gap-2"
        >
          <Image src="/whatsapp-icon.png" alt="phone" width={24} height={24} />
          <span className="text-dark-gray font-bold">{t("contact")}</span>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex flex-col text-dark-gray  items-center sm:items-end gap-1   text-center sm:text-right">
        <p className=" text-xs sm:text-sm">{t("email")}</p>
        <p className="italic text-xs sm:text-sm">{t("rights")}</p>
      </div>
    </div>
  );
};

export default Footer;
