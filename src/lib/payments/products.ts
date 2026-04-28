// Konfigurace produktů. Ceny jsou prozatímní — měň podle rozhodnutí o pricingu.
// Klíče musí odpovídat productKindEnum v drizzle/schema/enums.ts.

export type ProductKind =
  | "listing_publish"
  | "listing_boost"
  | "active_badge"
  | "database_access";

export type Product = {
  kind: ProductKind;
  name: string;
  description: string;
  /** Cena v korunách (celé Kč). Stripe používá haléře = priceCzk * 100. */
  priceCzk: number;
  /** Pokud true, produkt se v UI ještě nenabízí (skrytý). */
  hidden?: boolean;
  /** Doba platnosti v dnech (pro listing_boost atd.). */
  validityDays?: number;
};

export const PRODUCTS: Record<ProductKind, Product> = {
  listing_publish: {
    kind: "listing_publish",
    name: "Publikace inzerátu",
    description: "Zveřejnění jednoho inzerátu na 90 dní.",
    priceCzk: 0,
    hidden: true, // aktuálně zdarma
    validityDays: 90,
  },
  listing_boost: {
    kind: "listing_boost",
    name: "Zvýraznění inzerátu",
    description: "Tvůj inzerát bude 30 dní nahoře ve výpisu.",
    priceCzk: 99,
    validityDays: 30,
  },
  active_badge: {
    kind: "active_badge",
    name: "Badge „Aktivně hledá“",
    description:
      "Zelený badge u tvého profilu na 60 dní — vidí ho zaměstnavatelé jako prioritu.",
    priceCzk: 290,
    validityDays: 60,
  },
  database_access: {
    kind: "database_access",
    name: "Přístup k databázi profesionálů",
    description:
      "Roční přístup k seznamu profilů profesionálů s kontaktem, filtrováním a notifikacemi.",
    priceCzk: 990,
    validityDays: 365,
  },
};

export function getProduct(kind: ProductKind): Product {
  const p = PRODUCTS[kind];
  if (!p) throw new Error(`Neznámý produkt: ${kind}`);
  return p;
}

export function listVisibleProducts(): Product[] {
  return Object.values(PRODUCTS).filter((p) => !p.hidden);
}
