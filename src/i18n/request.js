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
  let localeFitness = {};
  let localeDownloadApp = {};
  let localeFooter = {};
  let localeAnnouncement = {};
  let localeStudio = {};
  let localeMethod = {};
  let localeBenefits = {};
  let localePackages = {};
  let localeSchedule = {};
  let localeTerms = {};
  let localeAccount = {};
  let localeAuth = {};

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
  try {
    localeFitness = await import(`../../messages/${locale}/fitness.json`).then(
      (m) => m.default
    );
  } catch (error) {
    /* missing -> fallback to en */
  }
  try {
    localeDownloadApp = await import(
      `../../messages/${locale}/downloadApp.json`
    ).then((m) => m.default);
  } catch (error) {
    /* missing -> fallback to en */
  }

  try {
    localeFooter = await import(`../../messages/${locale}/footer.json`).then(
      (m) => m.default
    );
  } catch (error) {
    /* missing -> fallback to en */
  }
  try {
    localeAnnouncement = await import(
      `../../messages/${locale}/announcement.json`
    ).then((m) => m.default);
  } catch (error) {
    /* missing -> fallback to en */
  }
  try {
    localeStudio = await import(`../../messages/${locale}/studio.json`).then(
      (m) => m.default
    );
  } catch (error) {
    /* missing -> fallback to en */
  }

  try {
    localeMethod = await import(`../../messages/${locale}/method.json`).then(
      (m) => m.default
    );
  } catch (error) {
    /* missing -> fallback to en */
  }
  try {
    localeBenefits = await import(
      `../../messages/${locale}/benefits.json`
    ).then((m) => m.default);
  } catch (error) {
    /* missing -> fallback to en */
  }

  try {
    localePackages = await import(
      `../../messages/${locale}/packages.json`
    ).then((m) => m.default);
  } catch (error) {
    /* missing -> fallback to en */
  }

  try {
    localeSchedule = await import(
      `../../messages/${locale}/schedule.json`
    ).then((m) => m.default);
  } catch (error) {
    /* missing -> fallback to en */
  }

  try {
    localeTerms = await import(`../../messages/${locale}/terms.json`).then(
      (m) => m.default
    );
  } catch (error) {
    /* missing -> fallback to en */
  }
  try {
    localeAccount = await import(`../../messages/${locale}/account.json`).then(
      (m) => m.default
    );
  } catch (error) {
    /* missing -> fallback to en */
  }

  try {
    localeAuth = await import(`../../messages/${locale}/auth.json`).then(
      (m) => m.default
    );
  } catch (error) {
    // If locale-specific auth file fails, fallback to English
    try {
      localeAuth = await import(`../../messages/en/auth.json`).then(
        (m) => m.default
      );
    } catch (fallbackError) {
      console.error("Failed to load auth messages:", error, fallbackError);
      localeAuth = {}; // Provide empty object to prevent null reference
    }
  }

  return {
    locale,
    messages: {
      home: localeHome,
      nav: localeNav,
      fitness: localeFitness,
      downloadApp: localeDownloadApp,
      footer: localeFooter,
      announcement: localeAnnouncement,
      studio: localeStudio,
      method: localeMethod,
      benefits: localeBenefits,
      packages: localePackages,
      schedule: localeSchedule,
      terms: localeTerms,
      account: localeAccount,
      auth: localeAuth,
    },
  };
});
