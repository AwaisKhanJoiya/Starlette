import './globals.css';
import { NextIntlClientProvider } from 'next-intl';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
