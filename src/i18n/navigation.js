// src/i18n/navigation.js
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Re-export for convenience
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

// Lightweight wrappers around Next.js' navigation APIs that consider the routing configuration
export const { Link, usePathname, useRouter, redirect, getPathname } =
  createNavigation(routing);
