import { ButtonLink } from "@/components/ui/button";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata = {
  title: "Nové heslo",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const token = sp.token;
  const tokenError = sp.error;

  if (!token || tokenError) {
    return (
      <>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-500)]">
          Reset hesla
        </p>
        <h1 className="display-sm mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
          Odkaz není platný
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {tokenError === "INVALID_TOKEN"
            ? "Tenhle odkaz na reset hesla už není platný (nejspíš vypršel)."
            : "Chybí token. Vyžádej si prosím nový odkaz na reset hesla."}
        </p>
        <div className="mt-6">
          <ButtonLink href="/forgot-password" size="md">
            Vyžádat nový odkaz
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
        Reset hesla
      </p>
      <h1 className="display-sm mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
        Nastav nové heslo
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Min. 10 znaků. Po nastavení tě přihlásíme.
      </p>
      <div className="mt-6">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
}
