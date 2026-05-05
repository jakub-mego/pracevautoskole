import Link from "next/link";
import type { PostMeta } from "@/lib/blog/types";
import { Faq, FaqItem } from "@/components/blog/faq";

export const meta: PostMeta = {
  slug: "kolik-bere-instruktor-autoskoly",
  title:
    "Kolik bere instruktor autoškoly? Plat, kvalifikace a cesta k profesi",
  description:
    "Práce instruktora autoškoly v roce 2026 — orientační plat, zákonné požadavky a cesta krok za krokem k profesnímu osvědčení. Komu se profese vyplatí.",
  publishedAt: "2026-05-05",
  author: "Tým pracevautoskole.cz",
  tags: ["kariera", "ucitel-autoskoly", "plat"],
};

export default function Article() {
  return (
    <>
      <p>
        Už jsi někdy seděl v proskleném openspacu a přál si prostě
        nastartovat a jet? <strong>Instruktor autoškoly</strong> je
        profese pro lidi, kteří milují dynamiku, řízení a svobodu. Není
        to jen o šlapání na spojku — je to o předávání zkušeností a
        radosti z pokroku tvých žáků. A finanční ohodnocení? Často
        vyšší, než si myslíš.
      </p>

      <h2>Kolik bere instruktor autoškoly v ČR</h2>

      <p>
        Plat se výrazně liší podle regionu, kategorií ŘP, formy
        spolupráce (HPP / OSVČ / brigáda) a tvojí praxe. Tady jsou
        orientační rozpětí pro českou autoškolu v roce 2026:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-left text-[var(--color-ink-muted)]">
              <th className="py-2 pr-4 font-medium">Parametr</th>
              <th className="py-2 pr-4 font-medium">Běžná kancelářská práce</th>
              <th className="py-2 font-medium">Instruktor autoškoly (full-time)</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink)]">
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Fixní složka</td>
              <td className="py-2 pr-4">Pevně daná, bez vlivu na výkon</td>
              <td className="py-2">Solidní základ + výkonnostní bonusy</td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Stereotyp</td>
              <td className="py-2 pr-4">Vysoký</td>
              <td className="py-2 font-semibold text-[var(--color-brand-800)]">
                Nulový
              </td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Typický příjem (HPP)</td>
              <td className="py-2 pr-4">35 000 – 45 000 Kč</td>
              <td className="py-2 font-semibold text-[var(--color-brand-800)]">
                40 000 – 60 000 Kč
              </td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Aktivní OSVČ</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2 font-semibold text-[var(--color-brand-800)]">
                70 000 Kč+ (vyšší kategorie ŘP)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Hodinová sazba se pohybuje 250–600 Kč podle kategorie ŘP a
        regionu. Učitelé s ŘP skupin C/CE nebo D/DE (nákladní vozy a
        autobusy) mají na trhu výrazně silnější pozici — poptávka po nich
        dlouhodobě převyšuje nabídku.
      </p>

      <h2>Jak se stát instruktorem autoškoly — krok za krokem</h2>

      <ol>
        <li>
          <strong>Věk a řidičák:</strong> Minimálně <strong>24 let</strong>{" "}
          a držení ŘP skupiny B (případně dalších, které chceš učit){" "}
          <strong>alespoň 3 roky</strong>.
        </li>
        <li>
          <strong>Vzdělání:</strong> Ukončené střední vzdělání s maturitou,
          případně výuční list v oboru auto-moto.
        </li>
        <li>
          <strong>Bezúhonnost:</strong> Čistý výpis z rejstříku trestů.
        </li>
        <li>
          <strong>Zdravotní způsobilost:</strong> Lékařské vyšetření a
          dopravně-psychologické posouzení.
        </li>
        <li>
          <strong>Kurz a zkouška:</strong> Absolvování odborného kurzu
          (80–120 h) a úspěšné složení zkoušky odborné způsobilosti před
          komisí krajského úřadu.
        </li>
        <li>
          <strong>Profesní průkaz učitele (PPU):</strong> Po složení
          zkoušky ti krajský úřad vystaví PPU — opravňuje k výuce a obnovuje
          se každých 5 let.
        </li>
      </ol>

      <p>
        Aktuální nabídku akreditovaných kurzů — některé i s úhradou
        z Úřadu práce přes program „Jsem v kurzu" — najdeš na stránce{" "}
        <Link href="/kurzy-pro-ucitele">
          kurzy pro budoucí učitele autoškoly
        </Link>
        .
      </p>

      <p>
        Detail kvalifikace, zákonných požadavků (zákon č. 247/2000 Sb.) a
        celostátních sazeb najdeš na stránce{" "}
        <Link href="/ucitel-autoskoly">učitel autoškoly</Link>.
      </p>

      <h2>Často kladené otázky</h2>

      <Faq>
        <FaqItem
          question="Zvládnu to, i když nemám trpělivost?"
          defaultOpen
        >
          Trpělivost je dovednost, kterou získáš s praxí. Pomáhá taky
          fakt, že duální pedály ti dávají kontrolu nad bezpečností —
          nemusíš se bát žákovy chyby. Každý žák je výzva, která tě
          posune dál.
        </FaqItem>
        <FaqItem question="Dá se to dělat na zkrácený úvazek?">
          Ano, práce instruktora je velmi flexibilní a skvěle funguje
          i jako přivýdělek nebo pozvolný start nové kariéry. Spousta
          učitelů jezdí jen pár hodin týdně po hlavní práci.
        </FaqItem>
        <FaqItem question="Vyplatí se to finančně oproti běžnému zaměstnání?">
          U HPP je rozdíl spíše v kvalitě života (flexibilita, dynamika,
          smysluplnost) než v plat-na-plat srovnání. Aktivní OSVČ
          s vyššími skupinami ŘP nebo s víkendovými jízdami často přesáhne
          70 000 Kč měsíčně, což je výrazně nad kancelářským průměrem.
        </FaqItem>
      </Faq>

      <h2>Chceš změnu? Začni jediným klikem</h2>

      <p>
        Cesta k volantu jako k pracovišti je dnes přímější, než si myslíš.
        Na <strong>pracevautoskole.cz</strong> si vytvoř profil učitele
        zdarma — i pokud teď ještě profesní osvědčení nemáš. Vyplň, kde
        chceš jezdit, jaké skupiny ŘP umíš a jakou kvalifikaci aktuálně
        máš nebo se ji chystáš získat. Autoškoly tě začnou kontaktovat
        samy.
      </p>

      <p>
        <Link href="/sign-up">Vytvořit profil učitele zdarma →</Link>
      </p>
    </>
  );
}
