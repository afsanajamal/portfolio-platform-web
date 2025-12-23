import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { TopNav } from "@/components/top-nav";

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <TopNav />
          <main className="mx-auto max-w-5xl p-4">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
