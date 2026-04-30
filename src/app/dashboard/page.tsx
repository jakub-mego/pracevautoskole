import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import {
  getProfileByUserId,
  getProfessionalRolesByProfileId,
  getCourtInterpreterProfileByProfileId,
} from "@/lib/profiles/queries";
import { getRecommendationsForProfile } from "@/lib/matching/queries";
import {
  listConversationsForProfile,
  countUnreadForProfile,
} from "@/lib/messaging/queries";
import { getListingStatsForProfile } from "@/lib/listings/queries";
import { RecommendationCard } from "@/components/matching/recommendation-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink, ArrowRight } from "@/components/ui/button";
import { CourtInterpreterDashboard } from "@/components/dashboard/court-interpreter-dashboard";
import { OtherWorkerRolePicker } from "@/components/forms/other-worker-role-picker";

export const metadata = {
  title: "Přehled",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");

  const profRoles =
    profile.type === "professional"
      ? await getProfessionalRolesByProfileId(profile.id)
      : [];

  if (
    profile.type === "professional" &&
    profRoles.length === 1 &&
    profRoles[0] === "court_interpreter"
  ) {
    const [details, conversations, unread] = await Promise.all([
      getCourtInterpreterProfileByProfileId(profile.id),
      listConversationsForProfile(profile.id),
      countUnreadForProfile(profile.id),
    ]);
    const recent = conversations.slice(0, 4).map((c) => ({
      id: c.conversation.id,
      name: c.counterpartAnonymousVisible
        ? "Anonymní profesionál"
        : c.counterpart.displayName,
      preview: c.lastMessageBody
        ? (c.lastMessageAuthorIsViewer ? "Ty: " : "") +
          (c.lastMessageBody.length > 80
            ? c.lastMessageBody.slice(0, 80) + "…"
            : c.lastMessageBody)
        : "Bez zpráv",
      unread: c.unread,
    }));
    return (
      <CourtInterpreterDashboard
        displayName={profile.displayName}
        details={details}
        unread={unread}
        conversations={recent}
      />
    );
  }

  const needsRolePick =
    profile.type === "professional" && profRoles.length === 0;

  const [recommendations, conversations, unread, listingStats] = await Promise.all([
    getRecommendationsForProfile(profile.id, 5),
    listConversationsForProfile(profile.id),
    countUnreadForProfile(profile.id),
    getListingStatsForProfile(profile.id),
  ]);
  const recentConversations = conversations.slice(0, 3);

  const stats = [
    { label: "Aktivní inzeráty", value: listingStats.active, href: "/listings" },
    {
      label: "Čeká na platbu",
      value: listingStats.pendingPayment,
      href: "/payments",
      hint: listingStats.pendingPayment > 0 ? "dokončit" : null,
    },
    { label: "Koncepty", value: listingStats.draft, href: "/listings" },
    {
      label: "Nepřečtené zprávy",
      value: unread,
      href: "/zpravy",
      hint: unread > 0 ? "nové" : null,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <Eyebrow>Přehled</Eyebrow>
        <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl md:text-5xl">
          Ahoj, {profile.displayName}.
        </h1>
        <p className="mt-3 text-base text-[var(--color-ink-muted)]">
          {profile.type === "employer"
            ? "Profil autoškoly · "
            : "Profil profesionála · "}
          <Link
            href="/profile"
            className="font-medium text-[var(--color-brand-700)] hover:underline"
          >
            upravit profil
          </Link>
        </p>
      </header>

      {needsRolePick ? (
        <section className="mt-8">
          <OtherWorkerRolePicker />
        </section>
      ) : null}

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 transition hover:border-[var(--color-brand-700)] hover:shadow-[var(--shadow-card-hover)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
              {s.label}
            </p>
            <p className="display-sm mt-2 text-3xl text-[var(--color-ink)] tabular-nums">
              {s.value}
            </p>
            {s.hint ? (
              <p className="mt-1 text-xs font-medium text-[var(--color-brand-700)]">
                {s.hint} →
              </p>
            ) : null}
          </Link>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
          <Eyebrow>Inzeráty</Eyebrow>
          <h2 className="display-xs mt-2 text-xl text-[var(--color-ink)]">
            {profile.type === "employer"
              ? "Hledáme do týmu"
              : "Hledám místo"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {profile.type === "employer"
              ? "Vytvoř inzerát — popis, role, lokalita, sazba."
              : "Vytvoř inzerát — co umíš, dojezd, sazby, dostupnost."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/listings/new" size="md" className="group">
              Nový inzerát <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/listings" variant="secondary" size="md">
              Moje inzeráty
            </ButtonLink>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
          <Eyebrow>Veřejný feed</Eyebrow>
          <h2 className="display-xs mt-2 text-xl text-[var(--color-ink)]">
            Co se právě poptává
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Procházej, co aktuálně poptávají autoškoly i profesionálové.
          </p>
          <div className="mt-5">
            <ButtonLink href="/inzeraty" variant="secondary" size="md">
              Procházet inzeráty
            </ButtonLink>
          </div>
        </article>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex items-baseline justify-between">
            <h2 className="display-sm text-2xl text-[var(--color-ink)] sm:text-3xl">
              Doporučení pro tebe
            </h2>
            <Link
              href="/inzeraty"
              className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
            >
              Více →
            </Link>
          </div>
          {recommendations.length ? (
            <ul className="mt-5 grid grid-cols-1 gap-3">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.match.id} rec={rec} />
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-6 text-sm text-[var(--color-ink-muted)]">
              Zatím žádná doporučení.{" "}
              {profile.type === "employer"
                ? "Doporučení se objeví, jakmile zveřejníš inzerát „hledáme do týmu“ a v systému budou aktivní profesionálové."
                : "Doporučení se objeví, jakmile budou v systému aktivní inzeráty autoškol odpovídající tvým rolím a kategoriím."}
            </div>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="display-sm text-2xl text-[var(--color-ink)] sm:text-3xl">
              Rozhovory
            </h2>
            <Link
              href="/zpravy"
              className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
            >
              Vše →
            </Link>
          </div>
          {recentConversations.length ? (
            <ul className="mt-5 flex flex-col gap-2">
              {recentConversations.map((c) => {
                const name = c.counterpartAnonymousVisible
                  ? "Anonymní profesionál"
                  : c.counterpart.displayName;
                const preview = c.lastMessageBody
                  ? (c.lastMessageAuthorIsViewer ? "Ty: " : "") +
                    (c.lastMessageBody.length > 80
                      ? c.lastMessageBody.slice(0, 80) + "…"
                      : c.lastMessageBody)
                  : "Bez zpráv";
                return (
                  <li
                    key={c.conversation.id}
                    className={
                      "rounded-2xl border bg-[var(--color-paper)] p-3 transition hover:border-[var(--color-brand-700)] " +
                      (c.unread
                        ? "border-[var(--color-brand-700)]"
                        : "border-[var(--color-line)]")
                    }
                  >
                    <Link
                      href={`/zpravy/${c.conversation.id}`}
                      className="flex flex-col gap-0.5"
                    >
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        {name}
                        {c.unread ? (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-600)] align-middle" />
                        ) : null}
                      </p>
                      <p className="line-clamp-1 text-xs text-[var(--color-ink-muted)]">
                        {preview}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-4 text-sm text-[var(--color-ink-muted)]">
              Zatím žádné rozhovory.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
