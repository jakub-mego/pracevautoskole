import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfileBySlug, getProfileContact } from "@/lib/profiles/queries";
import { listActiveListingsByProfile } from "@/lib/listings/queries";
import { getSession } from "@/lib/auth/server";
import { PROFESSIONAL_ROLE_LABELS } from "@/lib/profiles/labels";
import { AresVerifiedBadge } from "@/components/listings/ares-verified-badge";
import { VerifiedProfessionalBadge } from "@/components/profiles/verified-professional-badge";
import { MessageButton } from "@/components/messaging/message-button";
import { ReportDialog } from "@/components/reports/report-dialog";
import { getProfileByUserId } from "@/lib/profiles/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicProfileBySlug(slug);
  if (!data) return { title: "Profil nenalezen" };
  return { title: data.profile.displayName };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicProfileBySlug(slug);
  if (!data) notFound();

  const { profile, employer, professional, roles, licenses } = data;
  const session = await getSession();
  const [contact, listingRows, viewerProfile] = await Promise.all([
    session ? getProfileContact(profile.id) : Promise.resolve(null),
    listActiveListingsByProfile(profile.id),
    session ? getProfileByUserId(session.user.id) : Promise.resolve(null),
  ]);
  const isOwner = viewerProfile?.id === profile.id;
  const cityRegion = [profile.city, profile.region].filter(Boolean).join(" · ");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
        {profile.type === "employer" ? "Autoškola" : "Profesionál oboru"}
      </p>
      <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
        {profile.displayName}
        {profile.type === "employer" && employer?.aresVerifiedAt ? (
          <AresVerifiedBadge size="md" />
        ) : null}
        {profile.type === "professional" &&
        professional?.credentialsVerification === "verified" ? (
          <VerifiedProfessionalBadge size="md" />
        ) : null}
      </h1>
      {cityRegion ? <p className="mt-1 text-[var(--color-ink-muted)]">{cityRegion}</p> : null}

      {profile.about ? (
        <article className="mt-6 whitespace-pre-line text-[var(--color-ink)]">
          {profile.about}
        </article>
      ) : null}

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {profile.type === "employer" && employer ? (
          <Card title="Subjekt">
            <p className="text-sm text-[var(--color-ink)]">
              {employer.legalName}
              <br />
              <span className="text-[var(--color-ink-soft)]">IČO {employer.ico}</span>
            </p>
          </Card>
        ) : null}

        {profile.type === "professional" && professional && roles.length ? (
          <Card title="Co dělá">
            <ul className="flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <li
                  key={r}
                  className="rounded-md bg-[var(--color-canvas-muted)] px-2 py-1 text-xs text-[var(--color-ink)]"
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
                  className="rounded-md border border-[var(--color-line-strong)] px-2 py-1 text-xs text-[var(--color-ink)]"
                >
                  {l}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {profile.type === "professional" && professional?.activelySeeking ? (
          <Card title="Stav">
            <p className="text-sm text-[var(--color-brand-700)]">Aktivně hledá místo</p>
          </Card>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-base text-[var(--color-ink)]">Kontakt</h2>
        {!session ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            <Link href="/sign-in" className="font-medium text-[var(--color-ink)] underline">
              Přihlas se
            </Link>
            , abys viděl/a kontakt a mohl/a poslat zprávu.
          </p>
        ) : isOwner ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Tohle je tvůj profil.</p>
        ) : (
          <>
            <ContactInline contact={contact} />
            <div className="mt-4">
              <MessageButton
                recipientProfileId={profile.id}
                recipientName={profile.displayName}
              />
            </div>
          </>
        )}
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-base text-[var(--color-ink)]">
          Aktivní inzeráty ({listingRows.length})
        </h2>
        {listingRows.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Tento profil zatím nemá aktivní inzerát.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {listingRows.map((l) => (
              <li
                key={l.id}
                className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
              >
                <Link
                  href={`/inzeraty/${l.id}`}
                  className="text-sm font-medium text-[var(--color-ink)] hover:underline"
                >
                  {l.title}
                </Link>
                {l.city || l.region ? (
                  <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                    {[l.city, l.region].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {session && !isOwner ? (
        <section className="mt-8">
          <ReportDialog targetType="profile" targetId={profile.id} />
        </section>
      ) : null}
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ContactInline({
  contact,
}: {
  contact: Awaited<ReturnType<typeof getProfileContact>>;
}) {
  if (!contact) return <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Kontakt nedostupný.</p>;
  const has = contact.publicEmail || contact.phone || contact.website;
  if (!has) {
    return (
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        Inzerent zatím nedoplnil kontaktní údaje.
      </p>
    );
  }
  return (
    <ul className="mt-2 flex flex-col gap-1 text-sm text-[var(--color-ink)]">
      {contact.publicEmail ? (
        <li>
          <a
            href={`mailto:${contact.publicEmail}`}
            className="font-medium text-[var(--color-ink)] underline"
          >
            {contact.publicEmail}
          </a>
        </li>
      ) : null}
      {contact.phone ? (
        <li>
          <a
            href={`tel:${contact.phone.replace(/\s+/g, "")}`}
            className="font-medium text-[var(--color-ink)] underline"
          >
            {contact.phone}
          </a>
        </li>
      ) : null}
      {contact.website ? (
        <li>
          <a
            href={contact.website}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--color-ink)] underline"
          >
            {contact.website}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
