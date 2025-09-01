// src/i18n/navigation.js
import { createNavigation } from 'next-intl/navigation';

export const { Link, usePathname, useRouter } = createNavigation({
  locales: ['en', 'fr', 'es']
});
