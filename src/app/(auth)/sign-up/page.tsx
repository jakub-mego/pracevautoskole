import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata = {
  title: "Registrace",
};

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
        Registrace zdarma
      </p>
      <h1 className="display-sm mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
        Pojď to{" "}
        <em className="font-display italic font-medium text-[var(--color-brand-800)]">
          rozjet.
        </em>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Vyber, kdo jsi, a založ účet — pak rovnou doplníš jen to, co ke své
        roli potřebuješ.
      </p>
      <div className="mt-6">
        <SignUpForm />
      </div>
      <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
        Už máš účet?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[var(--color-brand-700)] hover:underline"
        >
          Přihlas se
        </Link>
      </p>
    </>
  );
}
