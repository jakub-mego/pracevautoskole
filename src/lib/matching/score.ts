export type ProfessionalRole =
  | "instructor"
  | "examiner"
  | "operator_admin"
  | "lecturer_48"
  | "manager"
  | "medic"
  | "court_interpreter"
  | "other";

export type LicenseCategory =
  | "AM" | "A1" | "A2" | "A"
  | "B1" | "B" | "BE"
  | "C1" | "C1E" | "C" | "CE"
  | "D1" | "D1E" | "D" | "DE"
  | "T";

export type RateRange = { min: number | null; max: number | null };

export type ScoreSubject = {
  region: string | null;
  city: string | null;
  roles: ProfessionalRole[];
  licenses: LicenseCategory[];
  rate?: RateRange | null;
};

export type ScoreCounterpart = ScoreSubject & {
  verified: boolean;
};

export type ScoreReason =
  | { kind: "role_match"; roles: ProfessionalRole[] }
  | { kind: "license_match"; licenses: LicenseCategory[] }
  | { kind: "same_region"; region: string }
  | { kind: "same_city"; city: string }
  | { kind: "rate_overlap" }
  | { kind: "verified" };

export type ScoreResult = { score: number; reasons: ScoreReason[] };

const WEIGHTS = {
  role: 50,
  license: 25,
  region: 10,
  city: 5,
  rate: 5,
  verified: 5,
} as const;

// Některé role nepotřebují řidičský průkaz pro shodu (např. zdravotník, manager).
const ROLES_REQUIRING_LICENSE: ProfessionalRole[] = [
  "instructor",
  "examiner",
];

function intersect<T>(a: T[], b: T[]): T[] {
  const set = new Set(a);
  return b.filter((x) => set.has(x));
}

function normalizeText(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length ? trimmed : null;
}

function rangesOverlap(a?: RateRange | null, b?: RateRange | null): boolean {
  if (!a || !b) return false;
  const aLow = a.min ?? a.max;
  const aHigh = a.max ?? a.min;
  const bLow = b.min ?? b.max;
  const bHigh = b.max ?? b.min;
  if (aLow == null || aHigh == null || bLow == null || bHigh == null) return false;
  return aLow <= bHigh && bLow <= aHigh;
}

/**
 * Skóruje, jak dobře sedí inzerát (jedné strany) k profilu/inzerátu protistrany.
 * Vrací 0–100. Bez shody role je skóre nulové (role je tvrdý filtr).
 */
export function scoreMatch(
  listing: ScoreSubject,
  counterpart: ScoreCounterpart,
): ScoreResult {
  const roleOverlap = intersect(listing.roles, counterpart.roles);
  if (roleOverlap.length === 0) {
    return { score: 0, reasons: [] };
  }

  const reasons: ScoreReason[] = [];
  let score = 0;

  const rolesUnion = new Set([...listing.roles, ...counterpart.roles]);
  const roleFraction = roleOverlap.length / Math.max(rolesUnion.size, 1);
  score += Math.round(WEIGHTS.role * (0.5 + 0.5 * roleFraction));
  reasons.push({ kind: "role_match", roles: roleOverlap });

  const requiresLicense = roleOverlap.some((r) =>
    ROLES_REQUIRING_LICENSE.includes(r),
  );
  if (requiresLicense) {
    const licenseOverlap = intersect(listing.licenses, counterpart.licenses);
    if (licenseOverlap.length > 0) {
      const union = new Set([...listing.licenses, ...counterpart.licenses]);
      const fraction = licenseOverlap.length / Math.max(union.size, 1);
      score += Math.round(WEIGHTS.license * (0.5 + 0.5 * fraction));
      reasons.push({ kind: "license_match", licenses: licenseOverlap });
    }
  } else {
    score += WEIGHTS.license;
  }

  const lr = normalizeText(listing.region);
  const cr = normalizeText(counterpart.region);
  if (lr && cr && lr === cr) {
    score += WEIGHTS.region;
    reasons.push({ kind: "same_region", region: listing.region!.trim() });

    const lc = normalizeText(listing.city);
    const cc = normalizeText(counterpart.city);
    if (lc && cc && lc === cc) {
      score += WEIGHTS.city;
      reasons.push({ kind: "same_city", city: listing.city!.trim() });
    }
  }

  if (rangesOverlap(listing.rate, counterpart.rate)) {
    score += WEIGHTS.rate;
    reasons.push({ kind: "rate_overlap" });
  }

  if (counterpart.verified) {
    score += WEIGHTS.verified;
    reasons.push({ kind: "verified" });
  }

  return { score: Math.min(score, 100), reasons };
}

export const MATCH_MIN_SCORE = 30;
