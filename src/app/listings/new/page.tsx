import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { ListingForm } from "@/components/forms/listing-form";

export const metadata = {
  title: "Nový inzerát",
};

export default async function NewListingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");

  const intent =
    profile.type === "employer" ? "employer_seeks" : "professional_seeks";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Nový inzerát
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Uložíme jako koncept. Než zveřejníš, můžeš si ho ještě upravit.
      </p>

      <div className="mt-8 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <ListingForm mode="create" intent={intent} />
      </div>
    </main>
  );
}
