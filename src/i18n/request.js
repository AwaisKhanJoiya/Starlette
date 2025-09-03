// src/i18n/request.js
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // try to load selected locale namespaces
  let localeHome = {};
  let localeNav = {};
  try {
    localeHome = await import(`../../messages/${locale}/home.json`).then(
      (m) => m.default
    );
  } catch (e) {
    /* missing -> fallback to en */
  }

  try {
    localeNav = await import(`../../messages/${locale}/nav.json`).then(
      (m) => m.default
    );
  } catch (e) {
    /* missing -> fallback to en */
  }

  return {
    locale,
    messages: {
      home: localeHome,
      nav: localeNav,
    },
  };
});
