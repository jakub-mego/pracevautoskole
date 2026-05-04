import { CookiePreferencesButton } from "@/components/forms/cookie-preferences-button";

export const metadata = {
  title: "Zásady používání cookies",
  description:
    "Jaké cookies používá pracevautoskole.cz, k čemu a jak nastavení zrušit.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-3xl text-[var(--color-ink)] sm:text-4xl">
        Zásady používání cookies
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Naposledy aktualizováno: 2026-05-04
      </p>

      <section className="prose prose-zinc mt-8 max-w-none text-[var(--color-ink)]">
        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">Co jsou cookies</h2>
        <p className="mt-2">
          Cookies jsou malé soubory, které web ukládá do tvého prohlížeče.
          Slouží zejména k udržení přihlášení mezi požadavky a k volitelnému
          měření návštěvnosti.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          Které cookies používáme
        </h2>

        <h3 className="mt-4 font-medium text-[var(--color-ink)]">Nezbytné (vždy aktivní)</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-left text-[var(--color-ink-muted)]">
              <th className="py-2 pr-4 font-medium">Název</th>
              <th className="py-2 pr-4 font-medium">Účel</th>
              <th className="py-2 font-medium">Trvání</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink-muted)]">
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4 font-mono text-xs">
                better-auth.session_token
              </td>
              <td className="py-2 pr-4">Udržení přihlášení uživatele.</td>
              <td className="py-2">30 dní</td>
            </tr>
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4 font-mono text-xs">pva_consent</td>
              <td className="py-2 pr-4">
                Uložení tvého rozhodnutí o cookies, abychom se neptali stále
                dokola.
              </td>
              <td className="py-2">1 rok</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Tyhle cookies nepotřebují tvůj souhlas — bez nich bys nemohl/a používat
          přihlášení.
        </p>

        <h3 className="mt-6 font-medium text-[var(--color-ink)]">Analytické (volitelné)</h3>
        <p className="mt-2">
          Pro měření návštěvnosti používáme <strong>Google Analytics 4</strong>{" "}
          (Google Ireland Limited). Spustí se <strong>jen tehdy, když udělíš
          souhlas</strong> v cookie banneru. Bez souhlasu se script ani
          nenahraje a žádné analytické cookies nevzniknou.
        </p>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-left text-[var(--color-ink-muted)]">
              <th className="py-2 pr-4 font-medium">Název</th>
              <th className="py-2 pr-4 font-medium">Účel</th>
              <th className="py-2 font-medium">Trvání</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink-muted)]">
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4 font-mono text-xs">_ga</td>
              <td className="py-2 pr-4">
                Rozlišení unikátních návštěvníků (anonymně).
              </td>
              <td className="py-2">2 roky</td>
            </tr>
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4 font-mono text-xs">_ga_JJDSBX6BC6</td>
              <td className="py-2 pr-4">
                Stav relace pro Google Analytics 4 (kontejner).
              </td>
              <td className="py-2">2 roky</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          IP adresa se anonymizuje (poslední oktet je odstraněn). Data jsou
          uložená v EU. Souhlas můžeš odvolat tlačítkem níže nebo smazáním
          cookies v prohlížeči.
        </p>

        <h3 className="mt-6 font-medium text-[var(--color-ink)]">Marketingové</h3>
        <p className="mt-2">
          Žádné nepoužíváme. Nepředáváme data inzertním sítím.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          Změna nastavení
        </h2>
        <p className="mt-2">
          Pokud jsi v minulosti udělil/a souhlas a chceš ho odvolat, klikni níže
          — banner se znovu objeví a můžeš volby upravit. Také můžeš cookies
          smazat přímo v nastavení prohlížeče.
        </p>
        <div className="mt-4">
          <CookiePreferencesButton />
        </div>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">Kontakt</h2>
        <p className="mt-2">
          Otázky k cookies posílej na{" "}
          <a
            href="mailto:info@onlymego.cz"
            className="font-medium text-[var(--color-ink)] underline"
          >
            info@onlymego.cz
          </a>
          .
        </p>
      </section>
    </main>
  );
}
