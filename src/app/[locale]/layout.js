import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import Navbar from "@/components/Navbar";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming locale is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages
  let messages;
  try {
    const homeMessages = (await import(`../../../messages/${locale}/home.json`))
      .default;
    const navMessages = (await import(`../../../messages/${locale}/nav.json`))
      .default;
    const fitnessMessages = (
      await import(`../../../messages/${locale}/fitness.json`)
    ).default;

    const downloadAppMessages = (
      await import(`../../../messages/${locale}/downloadApp.json`)
    ).default;

    const footerMessages = (
      await import(`../../../messages/${locale}/footer.json`)
    ).default;

    const announcementMessages = (
      await import(`../../../messages/${locale}/announcement.json`)
    ).default;
    const studioMessages = (
      await import(`../../../messages/${locale}/studio.json`)
    ).default;
    const methodMessages = (
      await import(`../../../messages/${locale}/method.json`)
    ).default;

    const benefitsMessages = (
      await import(`../../../messages/${locale}/benefits.json`)
    ).default;

    messages = {
      home: homeMessages,
      nav: navMessages,
      fitness: fitnessMessages,
      downloadApp: downloadAppMessages,
      footer: footerMessages,
      announcement: announcementMessages,
      studio: studioMessages,
      method: methodMessages,
      benefits: benefitsMessages,
    };
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
