import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY není nastaven. Bez něj nelze vytvořit checkout.",
    );
  }
  cached = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getWebhookSecret(): string {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s) {
    throw new Error("STRIPE_WEBHOOK_SECRET není nastaven.");
  }
  return s;
}
