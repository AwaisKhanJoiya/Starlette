// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr", "he"],

  // Used when no locale matches
  defaultLocale: "en",

  // Always show the locale prefix in the URL
  localePrefix: "always",
});
