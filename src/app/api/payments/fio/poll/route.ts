import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  fetchNewFioCredits,
  isFioConfigured,
} from "@/lib/payments/fio";
import { getPendingFioByVariableSymbol } from "@/lib/payments/queries";
import { applyPaymentEffect } from "@/lib/payments/apply-effect";
import { issueReceiptForPayment } from "@/lib/payments/receipt";
import { payments } from "../../../../../../drizzle/schema";
import type { ProductKind } from "@/lib/payments/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function checkAuth(request: Request) {
  const expected = process.env.FIO_POLL_TOKEN;
  if (!expected) return { ok: false, status: 503, body: "FIO_POLL_TOKEN není nastaven" };
  const got =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("token");
  if (got !== expected) {
    return { ok: false, status: 401, body: "unauthorized" };
  }
  return { ok: true };
}

export async function POST(request: Request) {
  const auth = checkAuth(request);
  if (!auth.ok) return new Response(auth.body, { status: auth.status });
  if (!isFioConfigured()) {
    return Response.json(
      { error: "Fio není nakonfigurované (chybí FIO_API_TOKEN)." },
      { status: 503 },
    );
  }

  let credits;
  try {
    credits = await fetchNewFioCredits();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fio fetch failed";
    return Response.json({ error: message }, { status: 502 });
  }

  let matched = 0;
  let underpaid = 0;
  let unmatched = 0;
  const errors: string[] = [];

  for (const tx of credits) {
    const pending = await getPendingFioByVariableSymbol(tx.variableSymbol);
    if (!pending) {
      unmatched++;
      continue;
    }
    if (tx.amountCzk < pending.amountCzk) {
      underpaid++;
      console.warn(
        `[fio poll] VS=${tx.variableSymbol}: zaplaceno ${tx.amountCzk}, požadováno ${pending.amountCzk} — neoznačeno jako paid`,
      );
      continue;
    }

    try {
      await db
        .update(payments)
        .set({
          status: "paid",
          paidAt: new Date(),
          externalId: tx.fioMoveId,
          metadata: {
            ...((pending.metadata as Record<string, unknown>) ?? {}),
            fioAmountCzk: tx.amountCzk,
          },
          updatedAt: new Date(),
        })
        .where(eq(payments.id, pending.id));

      if (pending.userId) {
        await applyPaymentEffect({
          product: pending.product as ProductKind,
          userId: pending.userId,
          listingId: pending.listingId,
        });
      }
      try {
        await issueReceiptForPayment(pending.id);
      } catch (err) {
        console.error("[fio poll] issue-receipt failed", err);
      }
      matched++;
    } catch (err) {
      const m = err instanceof Error ? err.message : "apply error";
      errors.push(`${pending.id}: ${m}`);
    }
  }

  return Response.json({
    fetched: credits.length,
    matched,
    underpaid,
    unmatched,
    errors,
  });
}

// GET pro snadné ruční ověření (kontroluje stejný token).
export async function GET(request: Request) {
  return POST(request);
}
