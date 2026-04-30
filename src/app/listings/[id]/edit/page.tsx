import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import {
  getOwnedListing,
  countPublishedListings,
} from "@/lib/listings/queries";
import {
  computeListingPublishPriceCzk,
  FREE_LISTING_QUOTA,
} from "@/lib/payments/products";
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

  let publishHint: { priceCzk: number; nextIndex: number } | null = null;
  if (
    !owned.listing.publishedAt &&
    (profile.type === "employer" || profile.type === "professional")
  ) {
    const publishedCount = await countPublishedListings(profile.id);
    const priceCzk = computeListingPublishPriceCzk({
      profileType: profile.type,
      alreadyPublishedCount: publishedCount,
    });
    publishHint = { priceCzk, nextIndex: publishedCount + 1 };
  }

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

      {publishHint ? (
        <div
          className={
            "mt-6 rounded-xl border p-4 text-sm " +
            (publishHint.priceCzk === 0
              ? "border-[var(--color-brand-200)] bg-[var(--color-brand-50)] text-[var(--color-brand-800)]"
              : "border-amber-200 bg-amber-50 text-amber-900")
          }
        >
          {publishHint.priceCzk === 0 ? (
            <>
              Tento bude tvůj <strong>{publishHint.nextIndex}.</strong> inzerát z{" "}
              {FREE_LISTING_QUOTA} zdarma. Zveřejnění je{" "}
              <strong>bez poplatku</strong>.
            </>
          ) : (
            <>
              Free quotu už máš spotřebovanou ({FREE_LISTING_QUOTA} zveřejněných).
              Zveřejnění tohoto inzerátu stojí{" "}
              <strong>{publishHint.priceCzk} Kč</strong>. Po kliknutí na
              „Zveřejnit“ tě přesměrujeme na platbu.
            </>
          )}
        </div>
      ) : null}

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
