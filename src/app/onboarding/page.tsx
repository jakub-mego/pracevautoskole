import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";

export const metadata = {
  title: "Začni s profilem",
};

const CARDS = [
  {
    href: "/onboarding/employer",
    title: "Autoškola",
    hint: "Hledám instruktory, examinátory, mistry praktického výcviku, lektory.",
  },
  {
    href: "/onboarding/professional?roles=instructor",
    title: "Učitel autoškoly",
    hint: "Učím v autoškole — teorii i praktickou jízdu.",
  },
  {
    href: "/onboarding/professional?roles=lecturer_48",
    title: "Lektor dle § 48",
    hint: "Vedu zákonem stanovená 48hod. školení řidičů.",
  },
  {
    href: "/onboarding/court-interpreter",
    title: "Soudní tlumočník",
    hint: "Tlumočím u zkoušek z odborné způsobilosti.",
  },
  {
    href: "/onboarding/other-worker",
    title: "Jiný pracovník",
    hint: "Admin, zdravotník nebo jiná role v autoškole — upřesníš v profilu.",
  },
];

export default async function OnboardingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Pojďme dokončit účet
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Kdo jsi na tržišti? Tohle ovlivní, co budeš inzerovat a koho uvidíš.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
          >
            <h2 className="display-xs text-lg text-[var(--color-ink)]">{c.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{c.hint}</p>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-[var(--color-ink-soft)]">
        Učitel autoškoly a lektor § 48 lze později spojit do jednoho profilu.
      </p>
    </main>
  );
}
