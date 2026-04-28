import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata = {
  title: "Přihlášení",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; verified?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");
  const sp = await searchParams;

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
        Přihlášení
      </p>
      <h1 className="display-sm mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
        Vítej zpátky.
      </h1>
      {sp.reset === "ok" ? (
        <p className="mt-4 rounded-lg border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-3 py-2 text-sm text-[var(--color-brand-800)]">
          Heslo bylo nastaveno. Přihlas se novým heslem.
        </p>
      ) : null}
      {sp.verified === "ok" ? (
        <p className="mt-4 rounded-lg border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-3 py-2 text-sm text-[var(--color-brand-800)]">
          E-mail ověřen.
        </p>
      ) : null}
      <div className="mt-6">
        <SignInForm />
      </div>
      <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
        Ještě nemáš účet?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-[var(--color-brand-700)] hover:underline"
        >
          Vytvoř ho zdarma
        </Link>
      </p>
    </>
  );
}
