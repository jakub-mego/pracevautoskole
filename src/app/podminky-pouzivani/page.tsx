export const metadata = {
  title: "Podmínky používání",
  description:
    "Pravidla provozu a používání tržiště pracevautoskole.cz pro autoškoly i profesionály oboru.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-3xl text-[var(--color-ink)] sm:text-4xl">
        Podmínky používání
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Naposledy aktualizováno: 2026-04-26
      </p>

      <section className="prose prose-zinc mt-8 max-w-none text-[var(--color-ink)]">
        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          1. Provozovatel
        </h2>
        <p className="mt-2">
          Webové stránky <code>pracevautoskole.cz</code> (dále jen „Služba“)
          provozuje:
        </p>
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
        <p className="mt-2">(dále jen „Provozovatel“).</p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          2. K čemu Služba slouží
        </h2>
        <p className="mt-2">
          Služba je tržiště zprostředkovávající kontakt mezi autoškolami a
          profesionály oboru (učitelé autoškoly, mistři praktického výcviku,
          lektoři 48hod. školení a další). Provozovatel
          není stranou pracovněprávního ani jiného vztahu mezi inzerenty a
          zájemci. Služba slouží výhradně k publikaci profilů a inzerátů a jejich
          vzájemnému vyhledání.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          3. Registrace a účet
        </h2>
        <ul className="mt-2 list-disc pl-6">
          <li>
            Registrovat se mohou fyzické osoby starší 18 let a právnické osoby
            (typicky autoškoly).
          </li>
          <li>
            Údaje uváděné při registraci a v profilu musí být pravdivé. Za
            obsah profilu i inzerátů odpovídá uživatel.
          </li>
          <li>
            Údaje o autoškole se v rámci ověření načítají z veřejného rejstříku
            ARES; jejich uvedení potvrzuje, že jsi oprávněn/a jednat za daný
            subjekt.
          </li>
          <li>
            Heslo neposkytuj třetím stranám. Za aktivitu pod účtem odpovídáš.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          4. Pravidla obsahu
        </h2>
        <p className="mt-2">Není dovoleno zveřejňovat:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>
            obsah, který porušuje platné právní předpisy nebo práva třetích osob
            (autorská práva, ochranné známky, GDPR);
          </li>
          <li>
            diskriminační inzeráty (pohlaví, věk, etnicita, sexuální orientace,
            zdravotní postižení, náboženské vyznání nebo členství v
            odborech) — viz § 4 zákona č. 435/2004 Sb. o zaměstnanosti;
          </li>
          <li>
            spam, opakující se inzeráty na téže pozici, MLM nabídky, podvodná
            schémata;
          </li>
          <li>
            inzeráty mimo obor autoškol a souvisejících profesí (řidičské
            školení, dopravní výchova, zdravotní příprava řidičů apod.);
          </li>
          <li>
            kontaktní údaje třetích osob bez jejich souhlasu;
          </li>
          <li>vulgární, urážlivý či výhružný obsah.</li>
        </ul>
        <p className="mt-2">
          Provozovatel si vyhrazuje právo bez náhrady smazat inzerát či profil,
          který tato pravidla porušuje, případně účet zablokovat.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          5. Platby
        </h2>
        <p className="mt-2">
          Aktuálně je publikace inzerátů zdarma. O případném zpoplatnění
          jednotlivých funkcí (např. zvýraznění inzerátu, ověřený badge, přístup
          k databázi) budeme předem informovat. Žádné poplatky neúčtujeme bez
          tvého souhlasu.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          6. Omezení odpovědnosti
        </h2>
        <ul className="mt-2 list-disc pl-6">
          <li>
            Provozovatel nezaručuje, že uvedené údaje uživatelů jsou pravdivé,
            úplné nebo aktuální.
          </li>
          <li>
            Provozovatel není odpovědný za kvalitu, bezpečnost ani legalitu
            práce nabízené nebo poptávané přes inzerát ani za jakékoli
            následné vztahy mezi inzerenty.
          </li>
          <li>
            Provozovatel si vyhrazuje právo Službu kdykoli omezit, odstavit nebo
            ukončit, zejména z důvodu plánované údržby. Za přerušení provozu
            nenese odpovědnost.
          </li>
          <li>
            Provozovatel nenese odpovědnost za škodu vzniklou v důsledku
            výpadku, ztráty dat nebo neoprávněného přístupu třetích osob, mimo
            případy hrubé nedbalosti.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          7. Smazání účtu a obsahu
        </h2>
        <p className="mt-2">
          Účet můžeš kdykoli smazat v sekci „Můj profil“. Smazání odstraní
          všechny tvé profily, inzeráty i sessiony nevratně. Provozovatel může
          účet zablokovat či smazat při hrubém porušení podmínek; kde to dává
          smysl, předem upozorní.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          8. Ochrana osobních údajů
        </h2>
        <p className="mt-2">
          Pravidla zpracování osobních údajů jsou v dokumentu{" "}
          <a
            href="/zasady-ochrany-osobnich-udaju"
            className="font-medium text-[var(--color-ink)] underline"
          >
            Zásady ochrany osobních údajů
          </a>
          .
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          9. Změny podmínek
        </h2>
        <p className="mt-2">
          Provozovatel může tyto podmínky přiměřeně měnit. Pokud změna
          významně mění tvoje práva, oznámí ji minimálně 14 dní předem
          e-mailem nebo bannerem v aplikaci.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          10. Rozhodné právo a soud
        </h2>
        <p className="mt-2">
          Vztah mezi tebou a Provozovatelem se řídí právním řádem České
          republiky. K rozhodování případných sporů jsou příslušné obecné
          soudy ČR. Spotřebitelé mají právo na mimosoudní řešení sporu u České
          obchodní inspekce (
          <a
            href="https://www.coi.cz"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--color-ink)] underline"
          >
            coi.cz
          </a>
          ).
        </p>

        <h2 className="mt-8 text-xl font-semibold text-[var(--color-ink)]">
          11. Kontakt
        </h2>
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
