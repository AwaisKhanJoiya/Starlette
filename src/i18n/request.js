// src/i18n/request.js
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(base, override) {
  if (!isObject(base)) return override ?? base;
  const out = { ...base };
  if (!isObject(override)) return out;
  for (const key of Object.keys(override)) {
    if (isObject(override[key]) && isObject(base[key])) {
      out[key] = deepMerge(base[key], override[key]);
    } else {
      out[key] = override[key];
    }
  }
  return out;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  // load english base namespaces
  const enHome = await import("../../messages/en/home.json").then(
    (m) => m.default
  );
  const enNav = await import("../../messages/en/nav.json").then(
    (m) => m.default
  );

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
      home: deepMerge(enHome, localeHome),
      nav: deepMerge(enNav, localeNav),
    },
  };
});
