// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

/** Create the plugin wrapper */
const withNextIntl = createNextIntlPlugin();

/** Export Next config wrapped with next-intl */
const nextConfig = withNextIntl({
  // you can add any other Next config options here
  // (optional) define i18n locales here as well for clarity:
  i18n: {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'en'
  }
});

export default nextConfig;
