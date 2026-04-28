"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startConversationAction } from "@/app/zpravy/actions";

export function MessageButton({
  recipientProfileId,
  recipientName,
  listingId,
  variant = "primary",
}: {
  recipientProfileId: string;
  recipientName: string;
  listingId?: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const buttonClass =
    variant === "primary"
      ? "rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)]"
      : "rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-canvas)]";

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        Poslat zprávu
      </button>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = body.trim();
    if (value.length < 2) {
      setError("Zpráva musí mít aspoň 2 znaky.");
      return;
    }
    setError(null);
    start(async () => {
      const res = await startConversationAction({
        recipientProfileId,
        listingId,
        body: value,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      if (res?.conversationId) {
        router.push(`/zpravy/${res.conversationId}`);
      }
    });
  }

  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
      <p className="text-sm font-medium text-[var(--color-ink)]">
        Napsat: <span className="text-[var(--color-ink-muted)]">{recipientName}</span>
      </p>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-2">
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          maxLength={4000}
          placeholder="Stručně se představ a napiš, co chceš domluvit. (Min. 2 znaky.)"
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-ink-soft)]">{body.length} / 4000</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1.5 text-sm text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={pending || body.trim().length < 2}
              className="rounded-md bg-[var(--color-ink)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
            >
              {pending ? "Posílám…" : "Odeslat"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
