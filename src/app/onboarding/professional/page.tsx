import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { ProfessionalOnboardingForm } from "@/components/forms/professional-onboarding-form";
import {
  PROFESSIONAL_ROLE_LABELS,
  type ProfessionalRoleKey,
} from "@/lib/profiles/labels";

export const metadata = {
  title: "Profil profesionála",
};

const ROLE_KEYS = Object.keys(PROFESSIONAL_ROLE_LABELS) as ProfessionalRoleKey[];

function parseRoles(raw: string | undefined): ProfessionalRoleKey[] {
  if (!raw) return [];
  const candidates = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const known = new Set<ProfessionalRoleKey>(ROLE_KEYS);
  const out: ProfessionalRoleKey[] = [];
  for (const c of candidates) {
    if (known.has(c as ProfessionalRoleKey) && !out.includes(c as ProfessionalRoleKey)) {
      out.push(c as ProfessionalRoleKey);
    }
  }
  return out;
}

export default async function ProfessionalOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ roles?: string }>;
}) {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");
  const sp = await searchParams;
  const defaultRoles = parseRoles(sp.roles);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Profil profesionála
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Pár základních údajů — později doplníš zkušenosti, sazby a inzerát.
      </p>

      <div className="mt-8">
        <ProfessionalOnboardingForm defaultRoles={defaultRoles} />
      </div>
    </main>
  );
}
