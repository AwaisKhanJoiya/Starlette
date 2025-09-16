import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
// import "../rtl.css";
import getRequestConfig from "@/i18n/request";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const { messages } = await getRequestConfig({ requestLocale: locale });

  // Ensure that the incoming locale is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Set dir to rtl for Hebrew, otherwise ltr
  // const dir = locale === "he" ? "rtl" : "ltr";
  return (
    <html
      lang={locale}
      // dir={dir}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="mx-auto bg-background">
            <Navbar />
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
