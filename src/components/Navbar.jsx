"use client";
import React, { useState, useRef, useEffect } from "react";
import { AlignLeft } from "lucide-react";
import { usePathname, useRouter, Link } from "../i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const langRef = useRef(null);

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "es", label: "ES" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Landing page check
  const isLanding = pathname === "/";

  // Icon color logic
  const iconColorClass = isLanding && !scrolled ? "text-white" : "text-black";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-colors duration-300 py-2 ${
        scrolled || !isLanding ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Side menu toggle */}
        <button
          onClick={() => setIsMenuOpen((s) => !s)}
          aria-label="Open menu"
          className={`z-50 ${iconColorClass}`}
        >
          <AlignLeft size={30} />
        </button>

        {/* Language dropdown */}
        <div className="relative" ref={langRef}>
          <Button
            variant="outline"
            size="sm"
            className={`bg-transparent ${
              isLanding && !scrolled
                ? "text-white border-white hover:bg-white hover:text-black"
                : "text-black border-black hover:bg-gray-100"
            }`}
            onClick={() => setIsLangOpen((s) => !s)}
          >
            {languages.find((l) => l.code === locale)?.label || "EN"}
          </Button>

          {isLangOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-24 bg-white text-black rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={async () => {
                    setIsLangOpen(false);
                    await router.replace(pathname, { locale: lang.code });
                    document.cookie = `locale=${lang.code};path=/;max-age=${
                      60 * 60 * 24 * 365
                    }`;
                  }}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    locale === lang.code
                      ? "font-semibold bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side menu */}
      <div
        className={`fixed w-36 rounded-md top-11 bg-black border border-white p-1 backdrop-blur-lg z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0 left-3" : "-translate-x-full left-0"
        }`}
      >
        <div className="px-1 space-y-2">
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
    </nav>
  );
}
