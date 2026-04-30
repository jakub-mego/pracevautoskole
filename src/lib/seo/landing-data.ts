import type { ProfessionalRole } from "@/lib/matching/score";

/**
 * Top česká města (~30 největších) pro programatic SEO landing pages.
 * Slug je bez diakritiky a malými písmeny — ekvivalent v hlavní DB by měl
 * být normalizován stejně.
 */
export const SEO_CITIES: { slug: string; name: string; region: string }[] = [
  { slug: "praha", name: "Praha", region: "Praha" },
  { slug: "brno", name: "Brno", region: "Jihomoravský kraj" },
  { slug: "ostrava", name: "Ostrava", region: "Moravskoslezský kraj" },
  { slug: "plzen", name: "Plzeň", region: "Plzeňský kraj" },
  { slug: "liberec", name: "Liberec", region: "Liberecký kraj" },
  { slug: "olomouc", name: "Olomouc", region: "Olomoucký kraj" },
  { slug: "ceske-budejovice", name: "České Budějovice", region: "Jihočeský kraj" },
  { slug: "hradec-kralove", name: "Hradec Králové", region: "Královéhradecký kraj" },
  { slug: "usti-nad-labem", name: "Ústí nad Labem", region: "Ústecký kraj" },
  { slug: "pardubice", name: "Pardubice", region: "Pardubický kraj" },
  { slug: "zlin", name: "Zlín", region: "Zlínský kraj" },
  { slug: "havirov", name: "Havířov", region: "Moravskoslezský kraj" },
  { slug: "kladno", name: "Kladno", region: "Středočeský kraj" },
  { slug: "most", name: "Most", region: "Ústecký kraj" },
  { slug: "karvina", name: "Karviná", region: "Moravskoslezský kraj" },
  { slug: "opava", name: "Opava", region: "Moravskoslezský kraj" },
  { slug: "frydek-mistek", name: "Frýdek-Místek", region: "Moravskoslezský kraj" },
  { slug: "decin", name: "Děčín", region: "Ústecký kraj" },
  { slug: "karlovy-vary", name: "Karlovy Vary", region: "Karlovarský kraj" },
  { slug: "jihlava", name: "Jihlava", region: "Vysočina" },
  { slug: "teplice", name: "Teplice", region: "Ústecký kraj" },
  { slug: "chomutov", name: "Chomutov", region: "Ústecký kraj" },
  { slug: "trinec", name: "Třinec", region: "Moravskoslezský kraj" },
  { slug: "trebic", name: "Třebíč", region: "Vysočina" },
  { slug: "prostejov", name: "Prostějov", region: "Olomoucký kraj" },
  { slug: "tabor", name: "Tábor", region: "Jihočeský kraj" },
  { slug: "cheb", name: "Cheb", region: "Karlovarský kraj" },
  { slug: "mlada-boleslav", name: "Mladá Boleslav", region: "Středočeský kraj" },
  { slug: "prerov", name: "Přerov", region: "Olomoucký kraj" },
  { slug: "pribram", name: "Příbram", region: "Středočeský kraj" },
];

/**
 * Role, které dávají smysl mít jako samostatnou landing page.
 * (operator_admin, manager nemá samostatnou keyword poptávku.)
 */
export const SEO_ROLES: {
  slug: string;
  role: ProfessionalRole;
  name: string;
  namePlural: string;
  intro: string;
}[] = [
  {
    slug: "ucitel-autoskoly",
    role: "instructor",
    name: "Učitel autoškoly",
    namePlural: "učitelů autoškoly",
    intro:
      "Učitelé autoškoly vyučují teorii i jízdy. Pro výkon profese je třeba minimálně 24 let, profesní způsobilost a 3 roky řízení v dané kategorii.",
  },
  {
    slug: "lektor-skoleni-ridicu",
    role: "lecturer_48",
    name: "Lektor pravidelného školení řidičů (§ 48)",
    namePlural: "lektorů pravidelného školení řidičů",
    intro:
      "Lektoři pravidelného školení vedou kurzy profesní způsobilosti dle § 48 zákona č. 247/2000 Sb. — typicky 35 hodin za 5 let.",
  },
];

export function getCityBySlug(slug: string) {
  return SEO_CITIES.find((c) => c.slug === slug);
}

export function getRoleBySlug(slug: string) {
  return SEO_ROLES.find((r) => r.slug === slug);
}

export function listAllLandingPaths(): {
  cities: { slug: string }[];
  roles: { slug: string }[];
  combos: { roleSlug: string; mestoSlug: string }[];
} {
  const combos: { roleSlug: string; mestoSlug: string }[] = [];
  for (const role of SEO_ROLES) {
    for (const city of SEO_CITIES) {
      combos.push({ roleSlug: role.slug, mestoSlug: city.slug });
    }
  }
  return {
    cities: SEO_CITIES.map((c) => ({ slug: c.slug })),
    roles: SEO_ROLES.map((r) => ({ slug: r.slug })),
    combos,
  };
}
