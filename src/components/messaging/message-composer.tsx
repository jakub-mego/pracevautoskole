"use client";

import { useState, useTransition } from "react";
import { sendMessageAction } from "@/app/zpravy/actions";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = body.trim();
    if (value.length < 2) {
      setError("Zpráva musí mít aspoň 2 znaky.");
      return;
    }
    setError(null);
    start(async () => {
      const res = await sendMessageAction({ conversationId, body: value });
      if (res?.error) {
        setError(res.error);
      } else {
        setBody("");
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={4000}
        placeholder="Napiš zprávu…"
        className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
      />
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-ink-soft)]">{body.length} / 4000</span>
        <button
          type="submit"
          disabled={pending || body.trim().length < 2}
          className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
        >
          {pending ? "Posílám…" : "Odeslat"}
        </button>
      </div>
    </form>
  );
}
