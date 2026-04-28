import { getSession } from "@/lib/auth/server";
import { ResendVerificationButton } from "@/components/forms/resend-verification-button";

export async function EmailVerificationBanner() {
  const session = await getSession();
  if (!session) return null;
  if (session.user.emailVerified) return null;

  return (
    <div className="border-b border-[var(--color-warning-bg)] bg-[var(--color-warning-bg)]/60">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 text-sm text-[var(--color-warning-fg)]">
        <p className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4.5zm0 6.75a.875.875 0 110 1.75.875.875 0 010-1.75z" />
          </svg>
          E-mail{" "}
          <span className="font-semibold">{session.user.email}</span> ještě není ověřený.
        </p>
        <ResendVerificationButton email={session.user.email} />
      </div>
    </div>
  );
}
