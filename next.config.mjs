// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

/** Create the plugin wrapper */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** Export Next config wrapped with next-intl */
const nextConfig = withNextIntl({
  // Add any other Next.js config options here
});

export default nextConfig;
