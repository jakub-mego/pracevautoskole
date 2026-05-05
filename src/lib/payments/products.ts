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

/** Limit free inzerátů na profil. Nad limit se účtuje. */
export const FREE_LISTING_QUOTA = 3;

/** Cena za zveřejnění dalšího inzerátu nad rámec free quoty (autoškola). */
export const LISTING_PUBLISH_PRICE_EMPLOYER_CZK = 790;
/** Cena za zveřejnění dalšího inzerátu nad rámec free quoty (profesionál). */
export const LISTING_PUBLISH_PRICE_PROFESSIONAL_CZK = 299;
/** Cena za zveřejnění kurzu pro učitele autoškoly — vždy, žádná free quota. */
export const LISTING_PUBLISH_PRICE_COURSE_CZK = 999;

/** Cena topování (boost) pro autoškolu — týden viditelnosti nahoře. */
export const BOOST_PRICE_EMPLOYER_CZK = 299;
/** Cena topování (boost) pro profesionála — týden viditelnosti nahoře. */
export const BOOST_PRICE_PROFESSIONAL_CZK = 99;
/** Doba boost expirace (dny). */
export const BOOST_DURATION_DAYS = 7;

export const PRODUCTS: Record<ProductKind, Product> = {
  listing_publish: {
    kind: "listing_publish",
    name: "Publikace inzerátu",
    description: "Zveřejnění jednoho inzerátu na 90 dní.",
    // Cena se počítá dynamicky podle profilu a počtu předchozích inzerátů
    // (computeListingPublishPriceCzk). Tahle hodnota je pouze fallback.
    priceCzk: LISTING_PUBLISH_PRICE_EMPLOYER_CZK,
    hidden: true,
    validityDays: 90,
  },
  listing_boost: {
    kind: "listing_boost",
    name: "Topování inzerátu",
    description:
      "Inzerát se zobrazí týden nahoře ve veřejném výpisu. Cena se liší podle typu profilu (autoškola 299 Kč, profesionál 99 Kč).",
    // Cena se počítá dynamicky dle profilu (computeBoostPriceCzk).
    // Tahle hodnota je fallback pro UI, které nezná typ profilu.
    priceCzk: BOOST_PRICE_EMPLOYER_CZK,
    hidden: true,
    validityDays: BOOST_DURATION_DAYS,
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

/**
 * Cena topování (boost) — záleží na typu profilu, ne na typu inzerátu.
 */
export function computeBoostPriceCzk(
  profileType: "employer" | "professional",
): number {
  return profileType === "employer"
    ? BOOST_PRICE_EMPLOYER_CZK
    : BOOST_PRICE_PROFESSIONAL_CZK;
}

/**
 * Cena za zveřejnění inzerátu — různé tarify dle listing_type.
 *
 * - employer_course: vždy 999 Kč (žádná free quota, kurz je placený produkt)
 * - employer_seeks: 3 free + 790 Kč (autoškola hledá lidi do týmu)
 * - professional_seeks: 3 free + 299 Kč (profesionál hledá místo)
 */
export function computeListingPublishPriceCzk(args: {
  profileType: "employer" | "professional";
  listingType?: "employer_seeks" | "professional_seeks" | "employer_course";
  alreadyPublishedCount: number;
}): number {
  if (args.listingType === "employer_course") {
    return LISTING_PUBLISH_PRICE_COURSE_CZK;
  }
  if (args.alreadyPublishedCount < FREE_LISTING_QUOTA) return 0;
  return args.profileType === "employer"
    ? LISTING_PUBLISH_PRICE_EMPLOYER_CZK
    : LISTING_PUBLISH_PRICE_PROFESSIONAL_CZK;
}
