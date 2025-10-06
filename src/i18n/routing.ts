// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr", "he"],

  // Used when no locale matches
  defaultLocale: "en",

  // Set to 'as-needed' so we can customize which routes get locale prefixes
  localePrefix: "as-needed",

  // Define which routes should be localized
  // For admin routes, we'll use the same path across all locales
  pathnames: {
    "/admin": "/admin",
    "/admin/login": "/admin/login",
    "/admin/dashboard": "/admin/dashboard",
    "/admin/classes": "/admin/classes",
    "/admin/classes/new": "/admin/classes/new",
    "/admin/classes/[id]": "/admin/classes/[id]",
    "/admin/classes/[id]/edit": "/admin/classes/[id]/edit",
  },
});
