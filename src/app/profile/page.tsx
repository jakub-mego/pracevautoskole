import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getFullProfileByUserId } from "@/lib/profiles/queries";
import { EmployerProfileForm } from "@/components/forms/employer-profile-form";
import { ProfessionalProfileForm } from "@/components/forms/professional-profile-form";
import { DeleteAccountDialog } from "@/components/forms/delete-account-dialog";

export const metadata = {
  title: "Můj profil",
};

export default async function ProfilePage() {
  const session = await requireSession();
  const data = await getFullProfileByUserId(session.user.id);
  if (!data) redirect("/onboarding");
  const { profile, employer, professional, roles, licenses } = data;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Můj profil
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        {profile.type === "employer"
          ? "Profil autoškoly. Kontaktní údaje uvidí přihlášení uživatelé na detailu inzerátu."
          : "Profil profesionála. Kontakt se nezobrazí veřejně, jen po přihlášení."}
      </p>

      <div className="mt-8 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        {profile.type === "employer" && employer ? (
          <EmployerProfileForm
            defaults={{
              displayName: profile.displayName,
              about: profile.about,
              region: profile.region,
              city: profile.city,
              postalCode: profile.postalCode,
              publicEmail: employer.publicEmail,
              phone: employer.phone,
              website: employer.website,
              legalName: employer.legalName,
              ico: employer.ico,
            }}
          />
        ) : profile.type === "professional" && professional ? (
          <ProfessionalProfileForm
            defaults={{
              displayName: profile.displayName,
              about: profile.about,
              region: profile.region,
              city: profile.city,
              postalCode: profile.postalCode,
              publicEmail: professional.publicEmail,
              phone: professional.phone,
              anonymous: professional.anonymous,
              activelySeeking: professional.activelySeeking,
              roles,
              licenses,
            }}
          />
        ) : null}
      </div>

      <section className="mt-10 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <h2 className="display-xs text-base text-[var(--color-ink)]">Tvoje data (GDPR)</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Stáhni si všechna svá data ve strojově čitelném formátu (JSON).
        </p>
        <Link
          href="/profile/export"
          prefetch={false}
          className="mt-4 inline-block rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        >
          Stáhnout export (JSON)
        </Link>
      </section>

      <section className="mt-10 rounded-xl border border-[var(--color-danger)] bg-[var(--color-paper)] p-6">
        <h2 className="text-base font-semibold text-[var(--color-danger)]">Nebezpečná zóna</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Smazání účtu je nevratné. Smaže se uživatel, profil, inzeráty a
          přihlášení.
        </p>
        <div className="mt-4">
          <DeleteAccountDialog />
        </div>
      </section>
    </main>
  );
}
