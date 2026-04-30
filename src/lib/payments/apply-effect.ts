import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings } from "../../../drizzle/schema";
import { getProduct, type ProductKind } from "./products";

/**
 * Aplikuje efekt zaplaceného produktu. Volá se po confirmed payment.
 * Idempotentní (volání 2x by mělo skončit ve stejném stavu).
 */
export async function applyPaymentEffect(input: {
  product: ProductKind;
  userId: string;
  listingId: string | null;
}) {
  const product = getProduct(input.product);
  const now = new Date();

  switch (input.product) {
    case "listing_boost": {
      if (!input.listingId) {
        console.warn("[payment] listing_boost bez listingId — skip");
        return;
      }
      const days = product.validityDays ?? 30;
      const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      await db
        .update(listings)
        .set({ boostedUntil: until, updatedAt: now })
        .where(eq(listings.id, input.listingId));
      return;
    }

    case "listing_publish": {
      if (!input.listingId) {
        console.warn("[payment] listing_publish bez listingId — skip");
        return;
      }
      const ninetyDays = new Date(now.getTime() + (product.validityDays ?? 90) * 24 * 60 * 60 * 1000);
      await db
        .update(listings)
        .set({
          status: "active",
          publishedAt: now,
          expiresAt: ninetyDays,
          updatedAt: now,
        })
        .where(eq(listings.id, input.listingId));
      return;
    }

    case "active_badge": {
      // TODO: až bude rozhodnuto. Zatím jen logujeme.
      console.log(
        `[payment] active_badge: user=${input.userId} (zatím no-op, čeká na rozhodnutí o vykreslení)`,
      );
      return;
    }

    case "database_access": {
      // TODO: až bude rozhodnuto. Zatím jen logujeme.
      console.log(
        `[payment] database_access: user=${input.userId} (zatím no-op, čeká na rozhodnutí)`,
      );
      return;
    }
  }
}
