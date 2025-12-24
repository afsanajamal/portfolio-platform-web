"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { getRole, isAuthed, type UserRole } from "@/lib/auth";
import { createTag, listTags, type Tag } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TagsPage() {
  const locale = useLocale();
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [authed, setAuthed] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);

  const canCreate = useMemo(() => role === "admin" || role === "editor", [role]);

  useEffect(() => {
    const authenticated = isAuthed();
    setAuthed(authenticated);
    setRole(getRole());

    // Redirect immediately if not authenticated
    if (!authenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [locale, router]);

  // load tags
  useEffect(() => {
    if (!authed) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await listTags();
        if (!cancelled) setTags(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Failed to load tags");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authed]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;

    setCreateErr(null);
    setCreating(true);

    try {
      const created = await createTag({ name });
      setTags((prev) => [created, ...prev]);
      setName("");
    } catch (e: any) {
      setCreateErr(e?.message ?? "Failed to create tag");
    } finally {
      setCreating(false);
    }
  }

  if (role === null) return null;
  if (!authed) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Tags</h1>
          <p className="text-sm text-slate-600">
            {canCreate ? "Create and view tags." : "View tags (read-only)."}
          </p>
        </CardHeader>

        <CardContent>
          {canCreate ? (
            <form onSubmit={onCreate} className="flex items-end gap-3">
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create tag"}
              </Button>

              {createErr ? <p className="text-sm text-red-600">{createErr}</p> : null}
            </form>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Tag list</h2>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : err ? (
            <p className="text-sm text-red-600">{err}</p>
          ) : tags.length === 0 ? (
            <p className="text-sm text-slate-600">No tags found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
