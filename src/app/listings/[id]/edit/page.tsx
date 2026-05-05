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
  computeBoostPriceCzk,
  BOOST_DURATION_DAYS,
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
      listingType: owned.listing.type as
        | "employer_seeks"
        | "professional_seeks"
        | "employer_course",
      alreadyPublishedCount: publishedCount,
    });
    publishHint = { priceCzk, nextIndex: publishedCount + 1 };
  }

  const boostPriceCzk =
    profile.type === "employer" || profile.type === "professional"
      ? computeBoostPriceCzk(profile.type)
      : null;
  const boostedUntil = owned.listing.boostedUntil;
  const isBoostActive =
    boostedUntil != null && new Date(boostedUntil).getTime() > Date.now();
  const showBoostBox =
    owned.listing.status === "active" &&
    owned.listing.type !== "employer_course" &&
    boostPriceCzk != null;

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
          {owned.listing.type === "employer_course" ? (
            <>
              Zveřejnění kurzu pro učitele autoškoly =&nbsp;jednorázový
              poplatek <strong>{publishHint.priceCzk} Kč</strong>. Po kliknutí
              na „Zveřejnit" tě přesměrujeme na platbu. Inzerát je pak 90 dní
              aktivní v sekci <em>Kurzy pro učitele</em>.
            </>
          ) : publishHint.priceCzk === 0 ? (
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
              „Zveřejnit" tě přesměrujeme na platbu.
            </>
          )}
        </div>
      ) : null}

      <div className="mt-6">
        <ListingActions id={id} status={owned.listing.status} />
      </div>

      {showBoostBox ? (
        <div className="mt-6 rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-800)]">
            Topování
          </p>
          {isBoostActive && boostedUntil ? (
            <>
              <h2 className="display-xs mt-1 text-lg text-[var(--color-ink)]">
                Inzerát je topovaný
              </h2>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                Zobrazuje se nahoře ve výpisu do{" "}
                <strong>
                  {new Date(boostedUntil).toLocaleString("cs-CZ", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
                . Můžeš topování prodloužit o další týden — čas se přičte
                k aktuálnímu konci.
              </p>
              <Link
                href={`/payments?listingId=${id}&product=listing_boost`}
                className="mt-4 inline-block rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-brand-700)]"
              >
                Prodloužit topování o {BOOST_DURATION_DAYS} dní za{" "}
                {boostPriceCzk} Kč
              </Link>
            </>
          ) : (
            <>
              <h2 className="display-xs mt-1 text-lg text-[var(--color-ink)]">
                Dostat inzerát nahoru ve výpisu
              </h2>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                Topování zviditelní inzerát na <strong>{BOOST_DURATION_DAYS}{" "}
                dní</strong> v hlavním feedu i na landing stránkách. Cena
                pro {profile.type === "employer" ? "autoškolu" : "profesionála"}
                : <strong>{boostPriceCzk} Kč</strong>.
              </p>
              <Link
                href={`/payments?listingId=${id}&product=listing_boost`}
                className="mt-4 inline-block rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-900)]"
              >
                Topovat za {boostPriceCzk} Kč / týden
              </Link>
            </>
          )}
        </div>
      ) : null}

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
            ratePracticeOwnCarMin: owned.listing.ratePracticeOwnCarMin,
            ratePracticeOwnCarMax: owned.listing.ratePracticeOwnCarMax,
            rateHealthMin: owned.listing.rateHealthMin,
            rateHealthMax: owned.listing.rateHealthMax,
            hasOwnVehicle: owned.listing.hasOwnVehicle,
            employmentType: owned.listing.employmentType,
            startAvailability: owned.listing.startAvailability,
            roles: owned.roles,
            licenses: owned.licenses,
            coursePriceCzk: owned.listing.coursePriceCzk,
            courseStartDate: owned.listing.courseStartDate,
            courseDurationHours: owned.listing.courseDurationHours,
          }}
        />
      </div>
    </main>
  );
}
