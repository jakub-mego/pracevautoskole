import Link from "next/link";
import type { PostMeta } from "@/lib/blog/types";
import { Faq, FaqItem } from "@/components/blog/faq";

export const meta: PostMeta = {
  slug: "ucitel-autoskoly-praha-kariera",
  title:
    "Učitel autoškoly v Praze: Staň se pánem pražských ulic, vyměň kancl za sedadlo instruktora",
  description:
    "Práce instruktora autoškoly v Praze — Praha 4, 5, 6, Smíchov, Dejvice. Flexibilita, smysluplnost a vyšší výdělek místo open-space. Co obnáší den za volantem.",
  publishedAt: "2026-05-05",
  author: "Tým pracevautoskole.cz",
  tags: ["kariera", "ucitel-autoskoly", "praha"],
};

export default function Article() {
  return (
    <>
      <p>
        Už tě nebaví sledovat svět jen přes tabulky v Excelu nebo zpoza
        monitoru v klimatizovaném open-spacu? Praha je město, které nikdy
        nespí, a její tep je nejvíce cítit tam, kde se asfalt potkává
        s pneumatikami. Práce instruktora v <strong>autoškole v Praze</strong>{" "}
        není jen o šlapání na spojku na straně spolujezdce. Je to o
        svobodě, o budování sebevědomí druhých a o tom, že každá tvoje
        „pracovní směna" má jinou trasu i jiný příběh.
      </p>

      <h2>Praha jako tvoje kancelář: Od Letné po Modřany</h2>

      <p>
        Praha není jen jedno město, je to mozaika revírů. Jako instruktor
        máš jedinečnou možnost si vybrat, kde se cítíš nejlépe.
      </p>

      <ul>
        <li>
          <strong>Autoškola Praha 4:</strong> tady ovládneš široké bulváry
          a logistiku kolem Pankráce.
        </li>
        <li>
          <strong>Autoškola Praha 5:</strong> Smíchov a okolí prověří
          postřeh v úzkých uličkách i na nájezdech na okruh.
        </li>
        <li>
          <strong>Autoškola Praha 6:</strong> Dejvice nabízejí přehlednost
          a prestižní klientelu.
        </li>
      </ul>

      <h3>Fenomén: Autoškola pro ženy Praha</h3>

      <blockquote
        style={{
          borderLeft: "4px solid var(--color-brand-700)",
          paddingLeft: "1rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          margin: "1.5rem 0",
          fontStyle: "italic",
          color: "var(--color-ink-muted)",
        }}
      >
        Mnoho žákyň hledá prostředí bez zbytečného stresu a křiku. Hledají
        empatii a trpělivost, kterou dokáží nabídnout právě instruktorky —
        a poptávka po nich v Praze stabilně roste.
      </blockquote>

      <h2>Srovnání: Život v kanclu vs. život za volantem</h2>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)] text-left text-[var(--color-ink-muted)]">
              <th className="py-2 pr-4 font-medium">Parametr</th>
              <th className="py-2 pr-4 font-medium">Práce v kanceláři</th>
              <th className="py-2 font-medium">Instruktor v autoškole</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink)]">
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Výhled</td>
              <td className="py-2 pr-4">Monitor, zeď, kávovar</td>
              <td className="py-2">Pražský hrad, Vltava, Stromovka</td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Flexibilita</td>
              <td className="py-2 pr-4">Fixní doba 8–17</td>
              <td className="py-2">Vlastní plánování</td>
            </tr>
            <tr className="border-b border-[var(--color-line)] align-top">
              <td className="py-2 pr-4 font-medium">Smysl</td>
              <td className="py-2 pr-4">Tabulky a reporty</td>
              <td className="py-2">Učíš dovednost pro život</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Detail kvalifikace, zákonných požadavků (zákon č. 247/2000 Sb.) a
        orientačních sazeb najdeš na celostátní stránce{" "}
        <Link href="/ucitel-autoskoly">učitel autoškoly</Link>.
      </p>

      <h2>Často kladené otázky</h2>

      <Faq>
        <FaqItem
          question="Zvládnu to, i když nemám nekonečnou trpělivost?"
          defaultOpen
        >
          Trpělivost je sval, který se trénuje. Uvidíš, že když vidíš
          pokroky svých žáků, klid přijde přirozeně. Plus duální pedály ti
          dávají kontrolu nad bezpečností, takže tě nezaskočí ani vyklepaný
          nováček v centru.
        </FaqItem>
        <FaqItem question="Dá se tato práce dělat na zkrácený úvazek?">
          Absolutně. Je to jeden z nejlepších jobů pro studenty nebo
          rodiče na mateřské. Můžeš odjezdit 10 i 40 hodin týdně, podle
          toho, kolik máš kapacity. Spousta učitelů jezdí jen odpoledne
          nebo o víkendech jako přivýdělek k hlavní práci.
        </FaqItem>
      </Faq>

      <h2>Chceš se stát legendou pražských silnic?</h2>

      <p>
        Na <strong>pracevautoskole.cz</strong> si vytvoř profil učitele
        zdarma. Vyplň, ve kterých částech Prahy chceš jezdit (Praha 4,
        Praha 5, Praha 6 — nebo jen rušné centrum, jak chceš), jaké
        skupiny ŘP umíš učit a kolik hodin týdně chceš odjezdit. Pražské
        autoškoly, které právě hledají kolegy, ti samy napíší.
      </p>

      <p>
        Procházet můžeš taky{" "}
        <Link href="/ucitel-autoskoly/praha">
          aktuální nabídky učitelů autoškoly v Praze
        </Link>{" "}
        nebo{" "}
        <Link href="/praha">všechny pražské inzeráty</Link>.
      </p>

      <p>
        <Link href="/sign-up">Vytvořit profil učitele zdarma →</Link>
      </p>
    </>
  );
}
