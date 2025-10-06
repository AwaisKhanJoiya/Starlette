import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  // Skip admin paths in the middleware
  alternativeLanguageCodes: ["en", "fr", "he"],
});

export default function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip the middleware for admin and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - ... if they start with `/api`, `/admin`, `/trpc`, `/_next` or `/_vercel`
  // - ... the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    "/((?!api|admin|trpc|_next|_vercel|.*\\..*).*)",
    "/",
    "/(en|fr|he)/:path*",
  ],
};
