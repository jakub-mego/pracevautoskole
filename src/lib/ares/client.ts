import { z } from "zod";

const ARES_BASE =
  process.env.ARES_BASE_URL ?? "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest";

const AresAddressSchema = z
  .object({
    kodStatu: z.string().optional(),
    nazevObce: z.string().optional(),
    nazevCastiObce: z.string().optional(),
    nazevUlice: z.string().optional(),
    cisloDomovni: z.number().int().optional(),
    cisloOrientacni: z.number().int().optional(),
    cisloOrientacniPismeno: z.string().optional(),
    psc: z.number().int().optional(),
    textovaAdresa: z.string().optional(),
  })
  .passthrough();

const AresSubjectSchema = z
  .object({
    ico: z.string(),
    obchodniJmeno: z.string(),
    sidlo: AresAddressSchema.optional(),
    pravniForma: z.string().optional(),
    datumVzniku: z.string().optional(),
    datumZaniku: z.string().optional(),
  })
  .passthrough();

export type AresSubject = z.infer<typeof AresSubjectSchema>;

export class AresError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "AresError";
  }
}

export async function lookupIco(ico: string): Promise<AresSubject | null> {
  const normalized = ico.replace(/\s+/g, "");
  if (!/^\d{8}$/.test(normalized)) {
    throw new AresError("IČO musí mít přesně 8 číslic");
  }

  const url = `${ARES_BASE}/ekonomicke-subjekty/${normalized}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new AresError(`ARES odpověděl ${res.status}`, res.status);
  }

  const json = await res.json();
  const parsed = AresSubjectSchema.safeParse(json);
  if (!parsed.success) {
    throw new AresError("Neznámý formát odpovědi z ARES");
  }

  if (parsed.data.datumZaniku) return null;

  return parsed.data;
}

export function isAutoskolaByName(name: string): boolean {
  return /autoško|auto\s*škol|školic[ií]\s+středisko/i.test(name);
}
