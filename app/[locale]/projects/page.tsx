"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { listProjects, type Project } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listProjects();
        setItems(data);
      } catch (e: any) {
        setError(typeof e?.message === "string" ? e.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-600">Authenticated endpoint: GET /projects</p>
        </CardHeader>
        <CardContent>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!error && items.length === 0 ? <p className="text-sm text-slate-600">{t("empty")}</p> : null}

          <ul className="mt-2 space-y-2">
            {items.map((p) => (
              <li key={p.id} className="rounded-md border border-slate-200 p-3">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-slate-600">{p.description}</div>
                <div className="mt-1 text-xs text-slate-500">{p.github_url}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
