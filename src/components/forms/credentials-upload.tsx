"use client";

import { useActionState } from "react";
import { uploadCredentialsAction } from "@/app/profile/actions";

type Status = "unverified" | "pending" | "verified" | "rejected";

const STATUS_BANNERS: Record<
  Status,
  { tone: string; title: string; body: string }
> = {
  unverified: {
    tone: "border-[var(--color-line)] bg-[var(--color-canvas)] text-[var(--color-ink-muted)]",
    title: "Bez ověření",
    body: "Pro získání odznaku „Ověřený profesionál“ nahraj sken nebo fotografii svého profesního průkazu (učitel autoškoly / průkaz zdravotníka / certifikát § 48). Soubor uvidí jen administrátor.",
  },
  pending: {
    tone: "border-amber-200 bg-amber-50 text-amber-900",
    title: "Čeká na schválení",
    body: "Doklad jsme přijali. Většinou kontrolujeme do 2 pracovních dnů. Po schválení dostaneš e-mail.",
  },
  verified: {
    tone: "border-[var(--color-brand-200)] bg-[var(--color-brand-50)] text-[var(--color-brand-900)]",
    title: "Ověřeno",
    body: "Odznak „Ověřený profesionál“ se ukazuje na tvém profilu i u tvých inzerátů. Pokud potřebuješ změnit doklad, můžeš ho nahrát znovu — ověření spadne zpět na čekající.",
  },
  rejected: {
    tone: "border-[var(--color-danger)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
    title: "Zamítnuto",
    body: "Doklad jsme nemohli ověřit. Nahraj prosím lepší sken / fotku.",
  },
};

export function CredentialsUpload({
  status,
  uploadedAt,
  rejectionReason,
}: {
  status: Status;
  uploadedAt: Date | null;
  rejectionReason: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadCredentialsAction,
    undefined,
  );
  const banner = STATUS_BANNERS[status];

  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-lg border px-4 py-3 text-sm ${banner.tone}`}>
        <p className="font-semibold">{banner.title}</p>
        <p className="mt-1 text-sm">{banner.body}</p>
        {status === "rejected" && rejectionReason ? (
          <p className="mt-2 text-sm">
            <span className="font-medium">Důvod: </span>
            {rejectionReason}
          </p>
        ) : null}
        {uploadedAt ? (
          <p className="mt-2 text-xs opacity-80">
            Naposledy nahráno: {uploadedAt.toLocaleString("cs-CZ")}
          </p>
        ) : null}
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">
            Soubor (JPG, PNG, PDF — max 10 MB)
          </span>
          <input
            type="file"
            name="credentials"
            accept="image/jpeg,image/png,application/pdf"
            required
            className="text-sm text-[var(--color-ink-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-ink)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[var(--color-brand-900)]"
          />
        </label>
        {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}
        {state?.ok ? (
          <p className="text-sm text-[var(--color-brand-700)]">
            Doklad nahrán a čeká na schválení.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
        >
          {pending ? "Nahrávám…" : "Nahrát doklad"}
        </button>
      </form>
    </div>
  );
}
