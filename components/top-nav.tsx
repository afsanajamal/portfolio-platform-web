"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { clearAuth, isAuthed } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function TopNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();

  const authed = typeof window !== "undefined" ? isAuthed() : false;

  function logout() {
    clearAuth();
    router.push(`/${locale}/login`);
  }

  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href={`/${locale}`} className="font-semibold text-slate-900">
          Portfolio Platform
        </Link>

        <nav className="flex items-center gap-3">
          <Link className="text-sm text-slate-700 hover:text-slate-900" href={`/${locale}/projects`}>
            {t("projects")}
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href={`/${locale}/users`}>
            {t("users")}
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href={`/${locale}/activity`}>
            {t("activity")}
          </Link>

          <div className="ml-2">
            <LanguageSwitcher />
          </div>

          {authed ? (
            <Button className="ml-2 h-9" variant="outline" onClick={logout}>
              {t("logout")}
            </Button>
          ) : (
            <Link href={`/${locale}/login`}>
              <Button className="ml-2 h-9" variant="outline">
                {t("login")}
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
