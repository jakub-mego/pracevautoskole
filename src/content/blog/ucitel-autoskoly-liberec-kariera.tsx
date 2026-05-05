import Link from "next/link";
import type { PostMeta } from "@/lib/blog/types";
import { Faq, FaqItem } from "@/components/blog/faq";

export const meta: PostMeta = {
  slug: "ucitel-autoskoly-liberec-kariera",
  title:
    "Učitel autoškoly v Liberci: Vyměň kancl za výhled na Ještěd",
  description:
    "Práce instruktora autoškoly a motoškoly v Liberci, Jablonci a Turnově. Co obnáší kariéra za volantem v Jizerských horách a jaké jsou typické sazby v regionu.",
  publishedAt: "2026-05-05",
  author: "Tým pracevautoskole.cz",
  tags: ["kariera", "ucitel-autoskoly", "liberec"],
};

export default function Article() {
  return (
    <>
      <p>
        Ruku na srdce: kolikrát už jsi dnes koukal z okna kanceláře na
        Ještěd a říkal si, že bys byl raději tam venku? Zatímco se tvoji
        známí stresují u nekonečných tabulek v Excelu, ty můžeš mít svou
        „kancelář" na čtyřech kolech v <strong>autoškole Liberec</strong>.
      </p>

      <h2>Proč být instruktorem v Liberci</h2>

      <p>
        Liberec, Jablonec, Turnov — Liberecký kraj patří mezi regiony
        s rostoucí poptávkou po kvalitních učitelích autoškoly. Nedostatek
        instruktorů zejména v menších městech znamená, že kvalitní
        kandidát najde místo rychle a může si vybírat.
      </p>

      <ul>
        <li>
          <strong>Svoboda a flexibilní plánování</strong> — diář si
          organizuješ sám, můžeš přizpůsobit rodině nebo druhému zaměstnání
        </li>
        <li>
          <strong>Práce venku, ne v open-spacu</strong> — ulice Liberce a
          okolí místo monitoru
        </li>
        <li>
          <strong>Každý den nový žák, nový příběh</strong>
        </li>
        <li>
          <strong>Moderní vozy</strong> — většina autoškol obměňuje flotilu
          každé 3–5 let
        </li>
      </ul>

      <h3>Bonus: Motoškola Liberec</h3>

      <p>
        Máš benzín v krvi a vlastníš oprávnění skupin A / A1 / A2? Učení
        jízdy na motocyklu je v Liberci a okolí relativně malý, ale dobře
        placený segment. Zatáčky Jizerských hor a Ještědu jsou ideální
        cvičný revír. Autoškoly nabízející kategorii A v regionu jsou na
        prstech jedné ruky, takže poptávka po lektorech převyšuje nabídku.
      </p>

      <h2>Srovnání: Kancl vs. autoškola</h2>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-left text-[var(--color-ink-muted)]">
              <th className="py-2 pr-4 font-medium">Parametr</th>
              <th className="py-2 pr-4 font-medium">Instruktor Liberec</th>
              <th className="py-2 font-medium">Běžná práce</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink)]">
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Prostředí</td>
              <td className="py-2 pr-4">Výhled na Ještěd, Jizerské hory</td>
              <td className="py-2">Zářivky a monitor</td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Stereotyp</td>
              <td className="py-2 pr-4">Nulový</td>
              <td className="py-2">Vysoký</td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Pohyb</td>
              <td className="py-2 pr-4">Maximální svoboda</td>
              <td className="py-2">Fixní přestávky</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Typické sazby v Libereckém kraji</h2>

      <p>
        Konkrétní výdělek závisí na autoškole, formě spolupráce (HPP /
        OSVČ / brigáda), kategoriích ŘP a regionu. Pro orientaci, jak se
        sazby v Liberci a okolí pohybují:
      </p>

      <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Pohodář — zkrácený úvazek
          </p>
          <p className="display-sm mt-2 text-2xl text-[var(--color-ink)] tabular-nums">
            ~25 – 35 000 Kč
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            10–20 hod týdně, ideálně jako přivýdělek
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-brand-700)] bg-[var(--color-brand-50)] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-800)]">
            Standard — plný úvazek
          </p>
          <p className="display-sm mt-2 text-2xl text-[var(--color-ink)] tabular-nums">
            ~45 – 65 000 Kč
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            HPP nebo OSVČ, 35–40 hod týdně
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Dříč — aktivní OSVČ
          </p>
          <p className="display-sm mt-2 text-2xl text-[var(--color-ink)] tabular-nums">
            70 000 Kč+
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Vyšší kategorie ŘP (C, D), víkendové jízdy
          </p>
        </div>
      </div>

      <p>
        Detail kvalifikace, zákonných požadavků a celostátních sazeb najdeš
        na stránce <Link href="/ucitel-autoskoly">učitel autoškoly</Link>.
      </p>

      <h2>Často kladené otázky</h2>

      <Faq>
        <FaqItem
          question="Musím být mistr světa v rally?"
          defaultOpen
        >
          Vůbec ne. Důležitá je bezpečnost, klid a schopnost vysvětlovat.
          Ostatní tě naučí kurz a praxe v autoškole.
        </FaqItem>
        <FaqItem question="Dá se to stíhat při rodině?">
          Ano, směny si plánuješ sám po dohodě s autoškolou. Chceš volné
          pátky nebo víkendy? Domluvitelné. Spousta učitelů jezdí jen
          dopoledne, dokud děti nejsou doma ze školy.
        </FaqItem>
        <FaqItem question="Mohu učit i motorky?">
          Pokud máš oprávnění odpovídající kategorie (A, A1, A2) a 3 roky
          praxe v ní, ano. Motoškoly v Liberci a okolí lektory aktivně
          shánějí — nabídka je menší než poptávka. Filtruj inzeráty
          v sekci{" "}
          <Link href="/ucitel-autoskoly/liberec">
            učitel autoškoly v Liberci
          </Link>{" "}
          a hledej autoškoly nabízející skupinu A.
        </FaqItem>
      </Faq>

      <h2>Začni jediným klikem</h2>

      <p>
        Nehledej jen další „práci". Staň se součástí oboru, kde tě práce
        bude reálně bavit. Na <strong>pracevautoskole.cz</strong> si vytvoř
        profil učitele zdarma. Vyplň, ve kterých městech v Libereckém kraji
        chceš jezdit (Liberec, Jablonec, Turnov…), jaké skupiny ŘP umíš
        učit a kolik hodin týdně máš kapacitu. Autoškoly z regionu, které
        právě hledají do týmu, ti budou psát samy.
      </p>

      <p>
        Procházet můžeš taky{" "}
        <Link href="/ucitel-autoskoly/liberec">
          aktuální nabídky učitelů autoškoly v Liberci
        </Link>{" "}
        nebo <Link href="/liberec">všechny liberecké inzeráty</Link>.
      </p>

      <p>
        <Link href="/sign-up">Vytvořit profil učitele zdarma →</Link>
      </p>
    </>
  );
}
