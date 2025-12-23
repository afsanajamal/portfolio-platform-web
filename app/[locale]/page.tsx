import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-slate-600">{t("subtitle")}</p>
      <p className="text-sm text-slate-500">
        Start at <code className="rounded bg-slate-100 px-1">/en/login</code> or{" "}
        <code className="rounded bg-slate-100 px-1">/ja/login</code>.
      </p>
    </div>
  );
}
