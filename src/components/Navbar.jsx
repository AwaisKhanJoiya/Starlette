"use client";
import React, { useState, useRef, useEffect } from "react";
import { AlignLeft, User } from "lucide-react";
import { usePathname, useRouter, Link } from "../i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/ui/UserProfileDropdown";
import { useUserAuthContext } from "@/context/UserAuthContext";

export default function Navbar() {
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUserAuthContext();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: t("HOME"), href: "/" },
    { label: t("THE_STUDIO"), href: "/studio" },
    { label: t("THE_METHOD"), href: "/method" },
    { label: t("PRICING"), href: "/pricing" },
    { label: t("SCHEDULE"), href: "/schedule" },
    ...(user ? [{ label: t("ACCOUNT"), href: "/account" }] : []),
  ];

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "he", label: "HE" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLanding = pathname === "/";
  const isAccount = pathname === "/account";
  const isPricing = pathname === "/pricing";
  // Icon color: white on dark bg, gray on light bg
  const iconColorClass =
    isLanding && !scrolled ? "text-white" : "text-gray-700";

  return (
    <nav
      className={`${isLanding || isPricing ? "fixed" : "sticky"} ${
        locale === "he" ? "rtl" : ""
      } top-0 z-50 w-full transition-colors duration-300`}
    >
      <div
        className={`relative px-4 sm:px-6 lg:px-8 flex min-h-16 items-center justify-between ${
          scrolled || (!isLanding && !isPricing)
            ? "bg-background"
            : "bg-transparent"
        }`}
      >
        {/* Left: Menu Icon */}
        <button
          onClick={() => setIsMenuOpen((s) => !s)}
          aria-label="Open menu"
          className={`z-50 ${iconColorClass}`}
        >
          <AlignLeft size={30} />
        </button>

        {/* Center: Logo (not on home page) */}
        {/* {!isLanding && ( */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          </Link>
        </div>
        {/* )} */}

        {/* Right: Language dropdown (home page) or user icon (account page) */}
        <div className="relative flex items-center gap-4">
          {/* {isLanding && ( */}
          <div className="relative">
            <Button
              variant="outline"
              className={`bg-transparent ${
                !scrolled && isLanding
                  ? "text-white border-white hover: hover:text-dark-gray"
                  : "text-dark-gray border-black hover:bg-gray-100"
              }`}
              onClick={() => setIsLangOpen((s) => !s)}
            >
              {languages.find((l) => l.code === locale)?.label || "EN"}
            </Button>

            {isLangOpen && (
              <div
                className={`absolute ${
                  locale === "he" ? "right-0" : "left-2"
                } w-24 rounded-md top-10 border backdrop-blur-lg z-40 transform transition-transform duration-300
              ${
                scrolled || !isLanding
                  ? "border-gray-300 bg-background "
                  : "border-white bg-transparent"
              }`}
              >
                {/* <div className="absolute  right-0 top-full mt-2 z-50 w-24  text-dark-gray rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden"> */}
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
                      scrolled || !isLanding ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              // </div>
            )}
          </div>
          {/* )} */}

          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          )}

          {isAccount && !user && (
            <div className="flex items-center">
              <User size={28} className={iconColorClass} />
            </div>
          )}
        </div>

        {isMenuOpen && (
          <div
            className={`absolute ${
              locale === "he" ? "right-2" : "left-2"
            } w-36 rounded-md top-16 border p-1 backdrop-blur-lg z-40 transform transition-transform duration-300
              ${
                scrolled || !isLanding
                  ? "border-gray-300 bg-background "
                  : "border-white bg-transparent"
              }`}
          >
            <div className="px-1 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-left font-bold text-xs ${
                    scrolled || !isLanding ? "text-gray-700" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side menu */}
    </nav>
  );
}
