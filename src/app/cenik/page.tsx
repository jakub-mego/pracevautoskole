import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Faq, FaqItem } from "@/components/blog/faq";
import {
  FREE_LISTING_QUOTA,
  LISTING_PUBLISH_PRICE_EMPLOYER_CZK,
  LISTING_PUBLISH_PRICE_PROFESSIONAL_CZK,
  LISTING_PUBLISH_PRICE_COURSE_CZK,
  BOOST_PRICE_EMPLOYER_CZK,
  BOOST_PRICE_PROFESSIONAL_CZK,
  BOOST_DURATION_DAYS,
} from "@/lib/payments/products";

export const metadata = {
  title: "Ceník",
  description:
    "Ceny inzerátů na pracevautoskole.cz — autoškola, profesionál, kurz pro učitele. První 3 pracovní inzeráty zdarma, kurz vždy placený.",
};

function fmtCzk(n: number): string {
  return new Intl.NumberFormat("cs-CZ").format(n) + " Kč";
}

type CardProps = {
  badge: string;
  title: string;
  free?: string;
  price: string;
  priceNote: string;
  bullets: string[];
  cta: { href: string; label: string };
  highlight?: boolean;
};

function PriceCard({
  badge,
  title,
  free,
  price,
  priceNote,
  bullets,
  cta,
  highlight,
}: CardProps) {
  return (
    <article
      className={
        "flex flex-col rounded-2xl border p-6 transition " +
        (highlight
          ? "border-[var(--color-brand-700)] bg-[var(--color-brand-50)] shadow-[var(--shadow-card-hover)]"
          : "border-[var(--color-line)] bg-[var(--color-paper)]")
      }
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
        {badge}
      </p>
      <h3 className="display-xs mt-2 text-xl text-[var(--color-ink)]">
        {title}
      </h3>

      {free ? (
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">{free}</p>
      ) : null}

      <div className="mt-3">
        <p className="display-sm text-3xl text-[var(--color-ink)] tabular-nums">
          {price}
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{priceNote}</p>
      </div>

      <ul className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-ink)]">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-[var(--color-brand-700)]">
              ✓
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Link
          href={cta.href}
          className={
            "block rounded-md px-4 py-2 text-center text-sm font-semibold transition " +
            (highlight
              ? "bg-[var(--color-ink)] text-white hover:bg-[var(--color-brand-900)]"
              : "border border-[var(--color-line-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[var(--color-brand-700)]")
          }
        >
          {cta.label}
        </Link>
      </div>
    </article>
  );
}

export default function CenikPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Breadcrumbs items={[{ label: "Ceník" }]} />

      <p className="mt-4 text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
        Ceník
      </p>
      <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl md:text-5xl">
        Ceny inzerátů, jasně a bez překvapení
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--color-ink-muted)]">
        Žádné předplatné, žádné skryté poplatky. Platíš jen za to, co
        zveřejníš — a první {FREE_LISTING_QUOTA} pracovní inzeráty na profil
        máš zdarma. Kurzy pro budoucí učitele jsou placené od prvního inzerátu.
      </p>

      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <PriceCard
          badge="Pro autoškoly"
          title="Pracovní inzerát"
          free={`Prvních ${FREE_LISTING_QUOTA} inzerátů zdarma`}
          price={fmtCzk(LISTING_PUBLISH_PRICE_EMPLOYER_CZK)}
          priceNote="za další inzerát · 90 dní aktivní"
          bullets={[
            'Inzerát „hledáme do týmu"',
            "Role, skupiny ŘP, lokalita, sazby",
            "Matching s aktivně hledajícími profesionály",
            "Po expiraci lze opětovně aktivovat zdarma",
          ]}
          cta={{ href: "/listings/new", label: "Vytvořit inzerát" }}
        />
        <PriceCard
          badge="Pro profesionály"
          title={`Inzerát „hledám místo"`}
          free={`Prvních ${FREE_LISTING_QUOTA} inzerátů zdarma`}
          price={fmtCzk(LISTING_PUBLISH_PRICE_PROFESSIONAL_CZK)}
          priceNote="za další inzerát · 90 dní aktivní"
          bullets={[
            "Učitel, lektor § 48, soudní tlumočník, …",
            "Co umíš, kam dojedeš, sazby",
            "Anonymní režim — jméno se odhalí až po kontaktu",
            "Po expiraci lze opětovně aktivovat zdarma",
          ]}
          cta={{ href: "/sign-up", label: "Vytvořit profil" }}
        />
        <PriceCard
          badge="Pro autoškoly"
          title="Kurz pro učitele"
          price={fmtCzk(LISTING_PUBLISH_PRICE_COURSE_CZK)}
          priceNote="za inzerát · 90 dní aktivní · žádná free quota"
          bullets={[
            "Inzerát kurzu pro budoucí učitele autoškoly",
            "Cena pro účastníka, datum startu, délka",
            "Vlastní landing /kurzy-pro-ucitele",
            "Placeno hned, žádná free quota",
          ]}
          cta={{ href: "/listings/new?type=course", label: "Inzerovat kurz" }}
          highlight
        />
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">
          Topování — dostat inzerát nahoru
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Topování zviditelní inzerát na <strong>{BOOST_DURATION_DAYS} dní</strong>{" "}
          v hlavním feedu i na všech landing stránkách (město, role, kombinace).
          Cena se liší podle typu profilu:
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
              Topování — autoškola
            </p>
            <p className="mt-1 display-sm text-2xl text-[var(--color-ink)] tabular-nums">
              {fmtCzk(BOOST_PRICE_EMPLOYER_CZK)}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              za týden viditelnosti nahoře ve výpisu
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
              Topování — profesionál
            </p>
            <p className="mt-1 display-sm text-2xl text-[var(--color-ink)] tabular-nums">
              {fmtCzk(BOOST_PRICE_PROFESSIONAL_CZK)}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              za týden viditelnosti nahoře ve výpisu
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
          Topování se kupuje až po zveřejnění inzerátu — najdeš ho jako
          tlačítko na stránce úprav inzerátu. Lze ho prodloužit kdykoliv
          v průběhu, čas se přičte k aktuálnímu konci.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="display-sm text-2xl text-[var(--color-ink)] sm:text-3xl">
          Jak to funguje
        </h2>
        <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <p className="display-xs text-2xl tabular-nums text-[var(--color-brand-700)]">
              01
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">
              Vytvoříš inzerát jako koncept
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Bez závazku. Prvních pár polí, později doladíš.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <p className="display-xs text-2xl tabular-nums text-[var(--color-brand-700)]">
              02
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">
              Klikneš „Zveřejnit"
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Pokud free quota stačí, inzerát je rovnou aktivní. Pokud ne,
              přesměrujeme tě na platbu.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <p className="display-xs text-2xl tabular-nums text-[var(--color-brand-700)]">
              03
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">
              Platba kartou nebo převodem
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Stripe (karta, doklad obratem) nebo bankovní převod (Fio,
              spárováno do hodiny).
            </p>
          </li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="display-sm text-2xl text-[var(--color-ink)] sm:text-3xl">
          Často kladené otázky
        </h2>
        <Faq>
          <FaqItem question="Jak funguje free quota 3 inzeráty?" defaultOpen>
            Každý profil — autoškola i profesionál — má prvních {FREE_LISTING_QUOTA}{" "}
            zveřejněných pracovních inzerátů zdarma. Free slot se spotřebuje
            v okamžiku, kdy inzerát poprvé přepneš na <em>aktivní</em>. Pauza,
            archivace ani expirace ho nevrací zpátky. Čtvrtý a další inzerát
            stojí 790 Kč (autoškola) nebo 299 Kč (profesionál).
          </FaqItem>
          <FaqItem question="Proč jsou kurzy pro učitele placené hned, bez free quoty?">
            Kurzy pro budoucí učitele autoškoly jsou samostatný produkt —
            poptávka po nich je stabilní a kurzy mají vlastní landing
            stránku, kde získávají dlouhodobou pozornost. Tomu odpovídá
            pevná cena {fmtCzk(LISTING_PUBLISH_PRICE_COURSE_CZK)} za 90 dní viditelnosti
            bez nutnosti spotřebovat „free slot", který autoškola raději
            ušetří na pracovní inzeráty.
          </FaqItem>
          <FaqItem question="Co se stane po 90 dnech?">
            Inzerát automaticky expiruje a přestane být veřejně viditelný.
            Můžeš ho ručně opětovně aktivovat — protože slot už byl
            spotřebován, je to <strong>zdarma</strong> bez ohledu na typ.
          </FaqItem>
          <FaqItem question="Jakými způsoby mohu zaplatit?">
            Stripe (Visa / Mastercard / Apple Pay / Google Pay — okamžité
            zveřejnění po platbě) nebo bankovní převod přes Fio (spárováno
            zpravidla do 1 hodiny v pracovní době, max do 24 hodin). Doklad
            o platbě dostaneš e-mailem automaticky.
          </FaqItem>
          <FaqItem question="Můžu dostat fakturu na firmu?">
            Ano, při platbě uvedeš IČO + DIČ a fakturu ti vystavíme. Pro
            opakované platby nebo větší objem (10+ inzerátů měsíčně)
            kontaktuj{" "}
            <a
              href="mailto:info@onlymego.cz"
              className="font-medium text-[var(--color-ink)] underline"
            >
              info@onlymego.cz
            </a>{" "}
            a domluvíme rámcovou smlouvu.
          </FaqItem>
          <FaqItem question="Co když platba selže nebo se inzerát nezveřejní?">
            Pokud z naší strany dojde k chybě (např. webhook nezpracuje
            platbu, kterou Stripe odhlásí jako úspěšnou), kontaktuj{" "}
            <a
              href="mailto:info@onlymego.cz"
              className="font-medium text-[var(--color-ink)] underline"
            >
              info@onlymego.cz
            </a>{" "}
            — vrátíme platbu nebo inzerát ručně publikujeme.
          </FaqItem>
        </Faq>
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-sm text-[var(--color-ink-muted)]">
        Ceny jsou uvedené včetně případné DPH dle zákonných pravidel.
        Kompletní pravidla najdeš v{" "}
        <Link
          href="/podminky-pouzivani"
          className="font-medium text-[var(--color-ink)] underline-offset-2 hover:underline"
        >
          podmínkách používání
        </Link>{" "}
        (§ 5 Platby a § 6 Exkluzivita kurzů).
      </section>
    </main>
  );
}
