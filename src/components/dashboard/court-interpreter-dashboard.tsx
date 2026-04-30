import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";

type CourtInterpreterDetails = {
  testTranslationPriceCzk: number | null;
  examTranslationPriceCzk: number | null;
  languages: string[];
  cities: string[];
};

type ConversationPreview = {
  id: string;
  name: string;
  preview: string;
  unread: boolean;
};

type Props = {
  displayName: string;
  details: CourtInterpreterDetails | null;
  unread: number;
  conversations: ConversationPreview[];
};

function formatCzk(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("cs-CZ").format(value) + " Kč";
}

export function CourtInterpreterDashboard({
  displayName,
  details,
  unread,
  conversations,
}: Props) {
  const languages = details?.languages ?? [];
  const cities = details?.cities ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <Eyebrow>Přehled</Eyebrow>
        <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl md:text-5xl">
          Ahoj, {displayName}.
        </h1>
        <p className="mt-3 text-base text-[var(--color-ink-muted)]">
          Profil soudního tlumočníka ·{" "}
          <Link
            href="/profile"
            className="font-medium text-[var(--color-brand-700)] hover:underline"
          >
            upravit profil
          </Link>
        </p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Překlad testu
          </p>
          <p className="display-sm mt-2 text-3xl text-[var(--color-ink)] tabular-nums">
            {formatCzk(details?.testTranslationPriceCzk ?? null)}
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Překlad zkoušky v autě
          </p>
          <p className="display-sm mt-2 text-3xl text-[var(--color-ink)] tabular-nums">
            {formatCzk(details?.examTranslationPriceCzk ?? null)}
          </p>
        </article>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
          <Eyebrow>Jazyky</Eyebrow>
          <h2 className="display-xs mt-2 text-xl text-[var(--color-ink)]">
            Tlumočím v jazycích
          </h2>
          {languages.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <li
                  key={lang}
                  className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper-soft)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]"
                >
                  {lang}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              Zatím nejsou vyplněné. <Link href="/profile" className="font-medium text-[var(--color-brand-700)] hover:underline">Doplň</Link>.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
          <Eyebrow>Působnost</Eyebrow>
          <h2 className="display-xs mt-2 text-xl text-[var(--color-ink)]">
            Města, kam dojíždím
          </h2>
          {cities.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {cities.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper-soft)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]"
                >
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              Zatím nejsou vyplněná. <Link href="/profile" className="font-medium text-[var(--color-brand-700)] hover:underline">Doplň</Link>.
            </p>
          )}
        </article>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="display-sm text-2xl text-[var(--color-ink)] sm:text-3xl">
            Rozhovory{" "}
            {unread > 0 ? (
              <span className="ml-2 rounded-full bg-[var(--color-brand-700)] px-2 py-0.5 text-xs font-semibold text-white align-middle">
                {unread}
              </span>
            ) : null}
          </h2>
          <Link
            href="/zpravy"
            className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
          >
            Vše →
          </Link>
        </div>
        {conversations.length ? (
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {conversations.map((c) => (
              <li
                key={c.id}
                className={
                  "rounded-2xl border bg-[var(--color-paper)] p-3 transition hover:border-[var(--color-brand-700)] " +
                  (c.unread
                    ? "border-[var(--color-brand-700)]"
                    : "border-[var(--color-line)]")
                }
              >
                <Link href={`/zpravy/${c.id}`} className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {c.name}
                    {c.unread ? (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-600)] align-middle" />
                    ) : null}
                  </p>
                  <p className="line-clamp-1 text-xs text-[var(--color-ink-muted)]">
                    {c.preview}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-2xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-4 text-sm text-[var(--color-ink-muted)]">
            Zatím žádné rozhovory. Autoškoly tě osloví, jakmile budou potřebovat tlumočení.
          </p>
        )}
      </section>
    </main>
  );
}
