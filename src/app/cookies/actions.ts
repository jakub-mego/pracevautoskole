"use server";

import { cookies } from "next/headers";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  serializeConsent,
} from "@/lib/cookies/consent";

export async function saveConsentAction(input: {
  analytics: boolean;
  marketing: boolean;
}) {
  const state = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    essential: true as const,
    analytics: Boolean(input.analytics),
    marketing: Boolean(input.marketing),
  };
  const store = await cookies();
  store.set(CONSENT_COOKIE, serializeConsent(state), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CONSENT_MAX_AGE,
  });
  return { ok: true };
}

export async function withdrawConsentAction() {
  const store = await cookies();
  store.delete(CONSENT_COOKIE);
  return { ok: true };
}
