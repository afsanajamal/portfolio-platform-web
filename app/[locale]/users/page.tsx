"use client";

import { useTranslations } from "next-intl";

export default function UsersPage() {
  const t = useTranslations("users");
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-slate-600">UI placeholder. We'll wire this to the backend next.</p>
    </div>
  );
}
