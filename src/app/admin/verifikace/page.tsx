import Link from "next/link";
import { listPendingVerifications } from "@/lib/admin/queries";
import { getPresignedGetUrl } from "@/lib/storage/client";
import { AdminCredentialRowActions } from "@/components/admin/admin-credential-row-actions";

export const metadata = {
  title: "Admin · Verifikace průkazů",
};

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  const rows = await listPendingVerifications();
  const enriched = await Promise.all(
    rows.map(async (r) => ({
      ...r,
      previewUrl: r.objectKey
        ? await getPresignedGetUrl(r.objectKey, 60 * 5).catch(() => null)
        : null,
    })),
  );

  return (
    <>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          Verifikace profesionálů
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          {enriched.length} čeká na schválení
        </p>
      </div>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        Otevři přiložený sken/PDF a zkontroluj jméno + platnost dokladu.
        Odkazy jsou krátkodobě platné (5 minut).
      </p>

      {enriched.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-6 text-sm text-[var(--color-ink-muted)]">
          Aktuálně nejsou žádné čekající žádosti.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {enriched.map((r) => (
            <li
              key={r.profile.id}
              className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-ink)]">
                    {r.profile.displayName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-soft)]">
                    {r.userEmail ?? "(účet smazán)"} · profil{" "}
                    <Link
                      href={`/p/${r.profile.slug}`}
                      className="underline hover:text-[var(--color-ink)]"
                    >
                      /p/{r.profile.slug}
                    </Link>
                  </p>
                  {r.uploadedAt ? (
                    <p className="mt-0.5 text-xs text-[var(--color-ink-soft)]">
                      Nahráno: {new Date(r.uploadedAt).toLocaleString("cs-CZ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {r.previewUrl ? (
                    <a
                      href={r.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1 text-xs font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas-muted)]"
                    >
                      Otevřít doklad ({r.contentType ?? "neznámý formát"})
                    </a>
                  ) : (
                    <span className="text-xs text-red-700">
                      Soubor chybí v úložišti.
                    </span>
                  )}
                  <AdminCredentialRowActions profileId={r.profile.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
