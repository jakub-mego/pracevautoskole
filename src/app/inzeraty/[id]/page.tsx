import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicListing } from "@/lib/listings/queries";
import { getProfileContact } from "@/lib/profiles/queries";
import { getSession } from "@/lib/auth/server";
import { PROFESSIONAL_ROLE_LABELS } from "@/lib/profiles/labels";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/listings/labels";
import { AresVerifiedBadge } from "@/components/listings/ares-verified-badge";
import { VerifiedProfessionalBadge } from "@/components/profiles/verified-professional-badge";
import { MessageButton } from "@/components/messaging/message-button";
import { ReportDialog } from "@/components/reports/report-dialog";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPublicListing(id);
  if (!data) return { title: "Inzerát nenalezen" };
  return { title: data.listing.title };
}

function fmtRate(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  if (min && max) return `${min}–${max} Kč`;
  if (min) return `od ${min} Kč`;
  return `do ${max} Kč`;
}

export default async function PublicListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPublicListing(id);
  if (!data) notFound();
  const {
    listing,
    profile,
    roles,
    licenses,
    anonymous,
    aresVerified,
    professionalVerified,
  } = data;
  const session = await getSession();
  const contact = session ? await getProfileContact(profile.id) : null;
  const viewerProfile = session
    ? await getProfileByUserId(session.user.id)
    : null;
  const isOwner = viewerProfile?.id === profile.id;

  const cityRegion = [listing.city, listing.region].filter(Boolean).join(" · ");
  const empLabel = EMPLOYMENT_TYPE_OPTIONS.find(
    (o) => o.value === listing.employmentType,
  )?.label;
  const rates = [
    ["Teorie", fmtRate(listing.rateTheoryMin, listing.rateTheoryMax)],
    ["Praxe", fmtRate(listing.ratePracticeMin, listing.ratePracticeMax)],
    ["Zdravotní", fmtRate(listing.rateHealthMin, listing.rateHealthMax)],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <main className="relative">
      <div className="absolute inset-0 surface-grain pointer-events-none opacity-30" />
      <div className="relative mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          href="/inzeraty"
          className="text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-brand-700)]"
        >
          ← Zpět na inzeráty
        </Link>

        <header className="mt-6">
          <Eyebrow>
            {listing.type === "employer_seeks"
              ? "Autoškola hledá"
              : "Profesionál nabízí sebe"}
          </Eyebrow>
          <h1 className="display-lg mt-2 text-4xl text-[var(--color-ink)] sm:text-5xl md:text-6xl">
            {listing.title}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-[var(--color-ink-muted)]">
            {anonymous ? (
              <span className="font-medium text-[var(--color-ink)]">
                {profile.displayName}
              </span>
            ) : (
              <Link
                href={`/p/${profile.slug}`}
                className="font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-700)] hover:underline"
              >
                {profile.displayName}
              </Link>
            )}
            {aresVerified ? <AresVerifiedBadge size="md" /> : null}
            {professionalVerified ? <VerifiedProfessionalBadge size="md" /> : null}
            {cityRegion ? (
              <span className="text-[var(--color-ink-soft)]">· {cityRegion}</span>
            ) : null}
          </p>
        </header>

        <article className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-ink)]">
          {listing.description}
        </article>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roles.length ? (
            <Card title="Role">
              <ul className="flex flex-wrap gap-1.5">
                {roles.map((r) => (
                  <li
                    key={r}
                    className="rounded-md bg-[var(--color-canvas-muted)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink)]"
                  >
                    {PROFESSIONAL_ROLE_LABELS[r as keyof typeof PROFESSIONAL_ROLE_LABELS]}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {licenses.length ? (
            <Card title="Skupiny ŘP">
              <ul className="flex flex-wrap gap-1.5">
                {licenses.map((l) => (
                  <li
                    key={l}
                    className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--color-ink-muted)]"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {empLabel || listing.startAvailability ? (
            <Card title="Spolupráce">
              {empLabel ? (
                <p className="text-sm text-[var(--color-ink-muted)]">
                  Forma: <span className="text-[var(--color-ink)]">{empLabel}</span>
                </p>
              ) : null}
              {listing.startAvailability ? (
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                  Nástup:{" "}
                  <span className="text-[var(--color-ink)]">
                    {listing.startAvailability}
                  </span>
                </p>
              ) : null}
            </Card>
          ) : null}

          {rates.length ? (
            <Card title="Sazby (Kč / 45 min)">
              <ul className="text-sm text-[var(--color-ink-muted)]">
                {rates.map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-3 py-0.5">
                    <span>{k}</span>
                    <span className="font-semibold tabular-nums text-[var(--color-ink)]">
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 sm:p-8">
          <Eyebrow>Kontakt</Eyebrow>
          <h2 className="display-xs mt-1 text-xl text-[var(--color-ink)] sm:text-2xl">
            Domluvte se přímo
          </h2>
          {!session ? (
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              <Link
                href="/sign-in"
                className="font-semibold text-[var(--color-brand-700)] underline-offset-2 hover:underline"
              >
                Přihlas se
              </Link>
              , abys viděl/a kontakt a mohl/a poslat zprávu.
            </p>
          ) : isOwner ? (
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              Tohle je tvůj inzerát.
            </p>
          ) : (
            <>
              {contact?.anonymous ? (
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                  Profesionál si přeje zůstat anonymní. Napiš mu/jí přímo —
                  identita se odhalí, jakmile ti odpoví.
                </p>
              ) : (
                <ContactBlock contact={contact} />
              )}
              <div className="mt-5">
                <MessageButton
                  recipientProfileId={profile.id}
                  recipientName={
                    contact?.anonymous
                      ? "Anonymní profesionál"
                      : profile.displayName
                  }
                  listingId={listing.id}
                />
              </div>
            </>
          )}
        </section>

        {!session ? (
          <section className="mt-6 text-center">
            <ButtonLink href="/sign-up" variant="secondary" size="md">
              Vytvořit účet zdarma
            </ButtonLink>
          </section>
        ) : null}

        {session && !isOwner ? (
          <section className="mt-8">
            <ReportDialog targetType="listing" targetId={listing.id} />
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

type Contact = Awaited<ReturnType<typeof getProfileContact>>;

function ContactBlock({ contact }: { contact: Contact }) {
  if (!contact) {
    return (
      <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
        Kontakt nedostupný.
      </p>
    );
  }

  const hasAny = contact.publicEmail || contact.phone || contact.website;
  if (!hasAny) {
    return (
      <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
        Inzerent zatím nedoplnil kontaktní údaje. Můžeš mu napsat zprávu.
      </p>
    );
  }

  return (
    <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      {contact.type === "employer" && contact.legalName ? (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Provozovatel
          </dt>
          <dd className="mt-1 text-[var(--color-ink)]">
            {contact.legalName}
            {contact.ico ? (
              <>
                <br />
                <span className="text-[var(--color-ink-soft)]">IČO {contact.ico}</span>
              </>
            ) : null}
          </dd>
        </div>
      ) : null}
      {contact.publicEmail ? (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            E-mail
          </dt>
          <dd>
            <a
              href={`mailto:${contact.publicEmail}`}
              className="font-semibold text-[var(--color-brand-700)] underline-offset-2 hover:underline"
            >
              {contact.publicEmail}
            </a>
          </dd>
        </div>
      ) : null}
      {contact.phone ? (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Telefon
          </dt>
          <dd>
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="font-semibold text-[var(--color-brand-700)] underline-offset-2 hover:underline"
            >
              {contact.phone}
            </a>
          </dd>
        </div>
      ) : null}
      {contact.website ? (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Web
          </dt>
          <dd>
            <a
              href={contact.website}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--color-brand-700)] underline-offset-2 hover:underline"
            >
              {contact.website}
            </a>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
