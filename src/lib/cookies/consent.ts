export type ConsentCategory = "essential" | "analytics" | "marketing";

export type ConsentState = {
  version: number;
  timestamp: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = "pva_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 rok

export function defaultConsent(): ConsentState {
  return {
    version: CONSENT_VERSION,
    timestamp: 0,
    essential: true,
    analytics: false,
    marketing: false,
  };
}

export function parseConsent(value: string | undefined): ConsentState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (typeof parsed !== "object" || !parsed) return null;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      timestamp: Number(parsed.timestamp ?? 0),
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function serializeConsent(state: ConsentState) {
  return encodeURIComponent(JSON.stringify(state));
}

// Banner se zobrazí pouze když je tahle hodnota true.
// Aktuálně true: GA4 (analytics) je nasazený a vyžaduje opt-in souhlas.
export const HAS_NON_ESSENTIAL_COOKIES = true;
