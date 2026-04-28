import { cookies } from "next/headers";
import {
  CONSENT_COOKIE,
  HAS_NON_ESSENTIAL_COOKIES,
  parseConsent,
} from "@/lib/cookies/consent";
import { CookieBannerClient } from "./cookie-banner-client";

export async function CookieBanner() {
  // Kontrola, jestli vůbec sbíráme něco mimo essential. Pokud ne, nezobrazujeme.
  if (!HAS_NON_ESSENTIAL_COOKIES) return null;

  const store = await cookies();
  const existing = parseConsent(store.get(CONSENT_COOKIE)?.value);
  if (existing) return null;

  return <CookieBannerClient />;
}
