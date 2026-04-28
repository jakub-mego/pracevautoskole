import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata = {
  title: "Zapomenuté heslo",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
        Reset hesla
      </p>
      <h1 className="display-sm mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
        Zapomenuté heslo
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Pošleme ti odkaz na reset. Platí jednu hodinu.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
        Máš heslo v paměti?{" "}
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
