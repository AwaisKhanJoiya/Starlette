"use client";
import React, { useState } from "react";
import { AlignLeft } from "lucide-react";
import { usePathname, useRouter, Link } from "../i18n/navigation";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "es", label: "ES" },
  ];

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 px-2 py-2">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsMenuOpen((s) => !s)}
            aria-label="Open menu"
          >
            <AlignLeft size={30} />
          </button>

          <div className="relative">
            <select
              defaultValue={router.locale || "en"}
              onChange={async (e) => {
                const newLocale = e.target.value;
                await router.replace(pathname, { locale: newLocale });
                document.cookie = `locale=${newLocale};path=/;max-age=${
                  60 * 60 * 24 * 365
                }`;
              }}
              className="bg-transparent px-3 py-1 text-white cursor-pointer"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      <div
        className={`fixed w-36 rounded-md top-11 bg-transparent border border-white p-1 backdrop-blur-lg z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0 left-3" : "-translate-x-full left-0"
        }`}
      >
        <div className="px-1">
          <Link
            href="/"
            className="block text-left text-white font-bold text-xs"
          >
            {t("HOME")}
          </Link>
          <Link
            href="/studio"
            className="block text-left text-white font-bold text-xs"
          >
            {t("THE_STUDIO")}
          </Link>
          <Link
            href="/method"
            className="block text-left text-white font-bold text-xs"
          >
            {t("THE_METHOD")}
          </Link>
          <Link
            href="/pricing"
            className="block text-left text-white font-bold text-xs"
          >
            {t("PRICING")}
          </Link>
          <Link
            href="/schedule"
            className="block text-left text-white font-bold text-xs"
          >
            {t("SCHEDULE")}
          </Link>
          <Link
            href="/account"
            className="block text-left text-white font-bold text-xs"
          >
            {t("ACCOUNT")}
          </Link>
        </div>
      </div>
    </div>
  );
}
