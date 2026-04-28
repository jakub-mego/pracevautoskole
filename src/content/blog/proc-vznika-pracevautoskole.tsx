import type { PostMeta } from "@/lib/blog/types";

export const meta: PostMeta = {
  slug: "proc-vznika-pracevautoskole",
  title: "Proč vzniká pracevautoskole.cz",
  description:
    "Obor autoškol potřebuje specializované místo pro spojení škol s instruktory, examinátory a lektory. Tady je důvod, proč jsme začali.",
  publishedAt: "2026-04-26",
  author: "Tým pracevautoskole.cz",
  tags: ["úvod", "vize"],
};

export default function Article() {
  return (
    <>
      <p>
        Pracovní inzeráty pro autoškoly se dnes ztrácejí mezi statisíci nabídek
        na obecných portálech. Učitel s ŘP B+C, který hledá místo, prochází
        výsledky, kde 99 % nesouvisí s autoškolami. Autoškola, která potřebuje
        do týmu mistra praktického výcviku nebo lektora 48hodinového školení,
        čeká týdny na prvního relevantního kandidáta.
      </p>

      <p>
        <strong>pracevautoskole.cz</strong> je odpověď: tržiště, kde se hledají
        výhradně lidé z oboru — učitelé autoškoly, mistři praktického výcviku,
        lektoři 48hodinového školení, provozní pracovníci a manažeři. Žádný
        šum, žádné nesouvisející nabídky.
      </p>

      <h2>Symetrické tržiště</h2>
      <p>
        Standardní pracovní portály jsou jednosměrné — zaměstnavatel inzeruje,
        kandidát hledá. My děláme tržiště <strong>symetricky</strong>: i
        profesionál si může založit profil a inzerovat „hledám místo“. Pro
        autoškoly je to zdroj kandidátů, kteří aktivně hledají; pro
        profesionály je to vlastní výkladní skříň.
      </p>

      <h2>Co je teď</h2>
      <ul>
        <li>Registrace zdarma pro autoškoly i profesionály oboru.</li>
        <li>
          Profil autoškoly s automatickým ověřením přes ARES — víme, že na
          druhé straně je reálná škola.
        </li>
        <li>
          Profily profesionálů s rolemi (instruktor, examinátor, mistr…) a
          skupinami ŘP, které učí.
        </li>
        <li>Inzeráty publikované zdarma s automatickou expirací po 90 dnech.</li>
        <li>
          Možnost vystupovat anonymně — zájemce kontaktuje skrze platformu, jméno
          se odhalí až po vzájemné shodě.
        </li>
      </ul>

      <h2>Co přijde</h2>
      <ul>
        <li>
          <strong>Matching engine</strong> — automatické párování inzerátů s
          profily na základě role, skupin ŘP a lokality.
        </li>
        <li>
          <strong>Messaging</strong> — zprávy přímo v platformě bez nutnosti
          sdílet e-mail.
        </li>
        <li>
          <strong>Verifikace osvědčení</strong> — zelený badge u učitelů, kteří
          doloží platná oprávnění.
        </li>
      </ul>

      <h2>Pro koho je to teď</h2>
      <p>
        Pokud jsi <em>autoškola</em>, která hledá někoho do týmu — registrace
        zabere 2 minuty. Po načtení IČO z ARESu doplníš pár polí a inzerát je
        venku.
      </p>
      <p>
        Pokud jsi <em>profesionál v oboru</em>, který chce být vidět — založ si
        profil a popiš, co umíš a kde chceš pracovat. I když zrovna místo
        nehledáš, hodí se mít profil připravený.
      </p>

      <p>
        Začínáme malí a budeme to stavět spolu s vámi. Jakákoli zpětná vazba je
        cenná — pište na{" "}
        <a href="mailto:kontakt@pracevautoskole.cz">kontakt@pracevautoskole.cz</a>.
      </p>
    </>
  );
}
