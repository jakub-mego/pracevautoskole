export const metadata = {
  title: "Zásady ochrany osobních údajů",
  description:
    "Jaké osobní údaje pracevautoskole.cz zpracovává, na základě čeho, jak dlouho a jaká máš práva.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-3xl text-[var(--color-ink)] sm:text-4xl">
        Zásady ochrany osobních údajů
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Naposledy aktualizováno: 2026-04-26
      </p>

      <section className="prose prose-zinc mt-8 max-w-none text-[var(--color-ink)]">
        <p>
          Ochrana tvých osobních údajů je pro nás důležitá. Tento dokument
          vysvětluje, jaké údaje sbíráme, na jakém právním základě, jak dlouho je
          uchováváme a jaká máš práva. Postupujeme v souladu s nařízením GDPR
          (2016/679) a zákonem č. 110/2019 Sb.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          1. Správce osobních údajů
        </h2>
        <p className="mt-2">
          <strong>Autoškola MeGo, s.r.o.</strong>
          <br />
          IČO: 23497297
          <br />
          Sídlo: Palackého třída 924/105, 612 00 Brno
          <br />
          Zapsaná v obchodním rejstříku vedeném Krajským soudem v&nbsp;Brně, oddíl C, vložka 146219
          <br />
          E-mail:{" "}
          <a
            href="mailto:info@onlymego.cz"
            className="font-medium text-[var(--color-ink)] underline"
          >
            info@onlymego.cz
          </a>
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Pověřence pro ochranu osobních údajů (DPO) jmenovaného nemáme — nemáme
          k tomu zákonnou povinnost (nezpracováváme osobní údaje ve velkém
          rozsahu ani citlivé kategorie).
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          2. Jaké údaje zpracováváme
        </h2>
        <h3 className="mt-4 font-medium text-[var(--color-ink)]">Účet</h3>
        <ul className="mt-2 list-disc pl-6">
          <li>jméno (zobrazované)</li>
          <li>e-mail</li>
          <li>heslo (uloženo jako hash, neukládáme v čitelné podobě)</li>
          <li>technické: IP adresa a user agent v relaci (sessions)</li>
        </ul>

        <h3 className="mt-4 font-medium text-[var(--color-ink)]">Profil autoškoly</h3>
        <ul className="mt-2 list-disc pl-6">
          <li>IČO, obchodní firma a sídlo (z veřejného rejstříku ARES)</li>
          <li>kontaktní e-mail, telefon, web (volitelné)</li>
          <li>popis činnosti</li>
        </ul>

        <h3 className="mt-4 font-medium text-[var(--color-ink)]">Profil profesionála</h3>
        <ul className="mt-2 list-disc pl-6">
          <li>zobrazované jméno (může být anonymní)</li>
          <li>kontaktní e-mail a telefon (volitelné)</li>
          <li>role v oboru, skupiny ŘP, město a kraj</li>
          <li>popis praxe</li>
        </ul>

        <h3 className="mt-4 font-medium text-[var(--color-ink)]">Inzeráty</h3>
        <ul className="mt-2 list-disc pl-6">
          <li>titulek, popis, lokalita, sazby, role, skupiny ŘP</li>
          <li>časy publikace a expirace</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          3. Účel a právní základ zpracování
        </h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-left text-[var(--color-ink-muted)]">
              <th className="py-2 pr-4 font-medium">Účel</th>
              <th className="py-2 pr-4 font-medium">Právní základ</th>
              <th className="py-2 font-medium">Doba</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink-muted)]">
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4">Provoz uživatelského účtu</td>
              <td className="py-2 pr-4">Plnění smlouvy (čl. 6 odst. 1 b)</td>
              <td className="py-2">Po dobu existence účtu</td>
            </tr>
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4">Zveřejnění inzerátu</td>
              <td className="py-2 pr-4">Plnění smlouvy (čl. 6 odst. 1 b)</td>
              <td className="py-2">90 dní + smazání po expiraci nebo archivaci</td>
            </tr>
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4">Transakční e-maily (verifikace, reset hesla)</td>
              <td className="py-2 pr-4">Plnění smlouvy</td>
              <td className="py-2">Po dobu nutnou pro doručení + log u poskytovatele</td>
            </tr>
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4">Bezpečnost a prevence zneužití</td>
              <td className="py-2 pr-4">
                Oprávněný zájem (čl. 6 odst. 1 f)
              </td>
              <td className="py-2">90 dní u logů</td>
            </tr>
            <tr className="border-b border-[var(--color-line)]">
              <td className="py-2 pr-4">Marketingová sdělení</td>
              <td className="py-2 pr-4">
                Souhlas (čl. 6 odst. 1 a) — aktuálně nezasíláme
              </td>
              <td className="py-2">Do odvolání souhlasu</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          4. Komu data předáváme (zpracovatelé)
        </h2>
        <p className="mt-2">
          Data zpracovávají pouze tito zpracovatelé na základě uzavřených smluv
          (DPA):
        </p>
        <ul className="mt-2 list-disc pl-6">
          <li>
            <strong>Hetzner Online GmbH</strong> (DE) — hosting serveru a
            databáze. Data jsou uložená v EU.
          </li>
          <li>
            <strong>Resend, Inc.</strong> (US) — odesílání transakčních e-mailů
            (verifikace, reset hesla). Předání do USA je kryto standardními
            smluvními doložkami EU.
          </li>
          <li>
            <strong>Stripe Payments Europe, Limited</strong> (IE) — zpracování
            online plateb kartou. Předáváme jen e-mail a referenční ID platby;
            údaje o kartě se k nám vůbec nedostanou.
          </li>
          <li>
            <strong>Fio banka, a.s.</strong> (ČR) — vedení účtu pro příjem
            bankovních převodů. Z banky čteme přehled došlých plateb pro
            spárování s objednávkou (variabilní symbol, částka, ID transakce).
          </li>
        </ul>
        <p className="mt-2">
          IČO subjektu z ARES (Ministerstvo financí ČR) získáváme veřejným
          dotazem; nejde o předání osobních údajů — ARES je veřejný rejstřík.
        </p>
        <p className="mt-2">
          Údaje neprodáváme. Data o tobě nesdílíme s reklamními sítěmi.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          5. Komu jsou údaje viditelné v aplikaci
        </h2>
        <ul className="mt-2 list-disc pl-6">
          <li>
            <strong>Veřejné</strong> (každý návštěvník): titulek a popis
            inzerátu, displayName a obecné údaje profilu (kromě anonymních
            profesionálů).
          </li>
          <li>
            <strong>Pouze přihlášení uživatelé</strong>: kontaktní e-mail,
            telefon a web inzerenta.
          </li>
          <li>
            <strong>Pouze ty</strong>: přihlašovací údaje a session detaily.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          6. Tvá práva
        </h2>
        <ul className="mt-2 list-disc pl-6">
          <li>
            <strong>Právo na přístup</strong> — můžeš si stáhnout své údaje (JSON
            export v sekci „Můj profil“).
          </li>
          <li>
            <strong>Právo na opravu</strong> — kdykoli upravíš v profilu.
          </li>
          <li>
            <strong>Právo na výmaz</strong> — tlačítkem „Smazat účet“ v sekci
            „Můj profil“. Smazání je nevratné a kaskádově odstraní všechny
            profily, inzeráty a sessiony.
          </li>
          <li>
            <strong>Právo na omezení zpracování</strong> a{" "}
            <strong>právo vznést námitku</strong> — pošli e-mail na{" "}
            <a
              href="mailto:kontakt@pracevautoskole.cz"
              className="font-medium text-[var(--color-ink)] underline"
            >
              kontakt@pracevautoskole.cz
            </a>
            .
          </li>
          <li>
            <strong>Právo na přenositelnost</strong> — JSON export odpovídá.
          </li>
          <li>
            <strong>Právo podat stížnost</strong> u Úřadu pro ochranu osobních
            údajů (
            <a
              href="https://www.uoou.cz"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--color-ink)] underline"
            >
              uoou.cz
            </a>
            ).
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          7. Zabezpečení
        </h2>
        <ul className="mt-2 list-disc pl-6">
          <li>HTTPS pro všechnu komunikaci.</li>
          <li>Hesla ukládáme jako hash (scrypt přes Better Auth).</li>
          <li>Session cookie má atributy <code>HttpOnly</code> a{" "}
            <code>SameSite=Lax</code>.</li>
          <li>Přístup k databázi je omezený a zalogovaný.</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          8. Změny zásad
        </h2>
        <p className="mt-2">
          Pokud zásady zásadně změníme, oznámíme to na hlavní stránce a u
          přihlášených uživatelů e-mailem.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">9. Kontakt</h2>
        <p className="mt-2">
          <a
            href="mailto:info@onlymego.cz"
            className="font-medium text-[var(--color-ink)] underline"
          >
            info@onlymego.cz
          </a>
        </p>
      </section>
    </main>
  );
}
