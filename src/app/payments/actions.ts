"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { newId } from "@/lib/utils/id";
import {
  getProduct,
  computeListingPublishPriceCzk,
  type ProductKind,
} from "@/lib/payments/products";
import { countPublishedListings } from "@/lib/listings/queries";
import { getStripe, isStripeConfigured } from "@/lib/payments/stripe";
import {
  generateUniqueVariableSymbol,
} from "@/lib/payments/queries";
import { listings, payments } from "../../../drizzle/schema";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function ownListing(listingId: string, profileId: string) {
  const rows = await db
    .select({ id: listings.id })
    .from(listings)
    .where(and(eq(listings.id, listingId), eq(listings.profileId, profileId)))
    .limit(1);
  return rows[0] ?? null;
}

async function resolveAmountCzk(
  product: ProductKind,
  profile: { id: string; type: "employer" | "professional" | string },
): Promise<number> {
  if (product !== "listing_publish") {
    return getProduct(product).priceCzk;
  }
  if (profile.type !== "employer" && profile.type !== "professional") {
    throw new Error("Neznámý typ profilu pro pricing.");
  }
  const publishedCount = await countPublishedListings(profile.id);
  return computeListingPublishPriceCzk({
    profileType: profile.type as "employer" | "professional",
    alreadyPublishedCount: publishedCount,
  });
}

export type StartCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function startStripeCheckoutAction(input: {
  product: ProductKind;
  listingId?: string;
}): Promise<StartCheckoutResult> {
  const session = await requireSession();
  if (!session.user.emailVerified) {
    return { ok: false, error: "Pro platbu si nejdřív ověř e-mail." };
  }
  if (!isStripeConfigured()) {
    return {
      ok: false,
      error: "Platby přes kartu zatím nejsou nakonfigurované.",
    };
  }
  const product = getProduct(input.product);
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return { ok: false, error: "Vytvoř si nejprve profil." };

  if (input.listingId) {
    const owned = await ownListing(input.listingId, profile.id);
    if (!owned) return { ok: false, error: "Inzerát nepatří tobě." };
  }

  const amountCzk = await resolveAmountCzk(input.product, profile);
  if (amountCzk <= 0) {
    return { ok: false, error: "Tento produkt je zdarma." };
  }

  const paymentId = newId();
  await db.insert(payments).values({
    id: paymentId,
    userId: session.user.id,
    listingId: input.listingId ?? null,
    product: input.product,
    provider: "stripe",
    status: "pending",
    amountCzk,
    metadata: { productName: product.name },
  });

  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session.user.email,
    line_items: [
      {
        price_data: {
          currency: "czk",
          unit_amount: amountCzk * 100,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
        quantity: 1,
      },
    ],
    client_reference_id: paymentId,
    metadata: {
      paymentId,
      userId: session.user.id,
      product: input.product,
      listingId: input.listingId ?? "",
    },
    success_url: `${APP_URL}/payments/success?id=${paymentId}`,
    cancel_url: `${APP_URL}/payments/cancelled?id=${paymentId}`,
  });

  await db
    .update(payments)
    .set({
      externalId: checkout.id,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, paymentId));

  if (!checkout.url) {
    return { ok: false, error: "Stripe nevrátil checkout URL." };
  }
  return { ok: true, url: checkout.url };
}

export type StartFioResult =
  | { ok: true; paymentId: string }
  | { ok: false; error: string };

export async function startFioPaymentAction(input: {
  product: ProductKind;
  listingId?: string;
}): Promise<StartFioResult> {
  const session = await requireSession();
  if (!session.user.emailVerified) {
    return { ok: false, error: "Pro platbu si nejdřív ověř e-mail." };
  }
  const product = getProduct(input.product);
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return { ok: false, error: "Vytvoř si nejprve profil." };

  if (input.listingId) {
    const owned = await ownListing(input.listingId, profile.id);
    if (!owned) return { ok: false, error: "Inzerát nepatří tobě." };
  }

  const amountCzk = await resolveAmountCzk(input.product, profile);
  if (amountCzk <= 0) {
    return { ok: false, error: "Tento produkt je zdarma." };
  }

  const variableSymbol = await generateUniqueVariableSymbol();
  const paymentId = newId();
  await db.insert(payments).values({
    id: paymentId,
    userId: session.user.id,
    listingId: input.listingId ?? null,
    product: input.product,
    provider: "fio",
    status: "pending",
    amountCzk,
    variableSymbol,
    metadata: { productName: product.name },
  });

  return { ok: true, paymentId };
}

export async function startStripeAndRedirect(input: {
  product: ProductKind;
  listingId?: string;
}) {
  const result = await startStripeCheckoutAction(input);
  if (!result.ok) return result;
  redirect(result.url);
}
