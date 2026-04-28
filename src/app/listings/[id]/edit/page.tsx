import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { getOwnedListing } from "@/lib/listings/queries";
import { ListingForm } from "@/components/forms/listing-form";
import { ListingActions } from "@/components/listings/listing-actions";
import { ListingStatusBadge } from "@/components/listings/listing-status-badge";

export const metadata = {
  title: "Úprava inzerátu",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");

  const owned = await getOwnedListing(id, profile.id);
  if (!owned) notFound();

  const intent = owned.listing.type;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
            Úprava inzerátu
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-[var(--color-ink-muted)]">
            <ListingStatusBadge status={owned.listing.status} />
            {owned.listing.status === "active" ? (
              <Link
                href={`/inzeraty/${id}`}
                className="text-[var(--color-ink)] underline"
              >
                Veřejný náhled
              </Link>
            ) : null}
          </div>
        </div>
        <Link
          href="/listings"
          className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          ← Moje inzeráty
        </Link>
      </div>

      <div className="mt-6">
        <ListingActions id={id} status={owned.listing.status} />
      </div>

      <div className="mt-8 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <ListingForm
          mode="edit"
          listingId={id}
          intent={intent}
          defaults={{
            title: owned.listing.title,
            description: owned.listing.description,
            region: owned.listing.region,
            city: owned.listing.city,
            postalCode: owned.listing.postalCode,
            remoteFriendly: owned.listing.remoteFriendly,
            travelRadiusKm: owned.listing.travelRadiusKm,
            rateTheoryMin: owned.listing.rateTheoryMin,
            rateTheoryMax: owned.listing.rateTheoryMax,
            ratePracticeMin: owned.listing.ratePracticeMin,
            ratePracticeMax: owned.listing.ratePracticeMax,
            rateHealthMin: owned.listing.rateHealthMin,
            rateHealthMax: owned.listing.rateHealthMax,
            employmentType: owned.listing.employmentType,
            startAvailability: owned.listing.startAvailability,
            roles: owned.roles,
            licenses: owned.licenses,
          }}
        />
      </div>
    </main>
  );
}
