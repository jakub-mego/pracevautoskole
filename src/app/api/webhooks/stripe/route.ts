import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getStripe, getWebhookSecret } from "@/lib/payments/stripe";
import { applyPaymentEffect } from "@/lib/payments/apply-effect";
import { issueReceiptForPayment } from "@/lib/payments/receipt";
import { payments } from "../../../../../drizzle/schema";
import type { ProductKind } from "@/lib/payments/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return new Response("missing stripe-signature", { status: 400 });
  }
  const rawBody = await request.text();

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, getWebhookSecret());
  } catch (err) {
    const message = err instanceof Error ? err.message : "verify failed";
    return new Response(`signature error: ${message}`, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;
    const paymentId =
      session.client_reference_id ??
      (session.metadata?.paymentId as string | undefined);
    if (!paymentId) {
      console.warn("[stripe webhook] chybí paymentId v session");
      return Response.json({ received: true });
    }

    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);
    const payment = rows[0];
    if (!payment) {
      console.warn(`[stripe webhook] payment ${paymentId} nenalezen`);
      return Response.json({ received: true });
    }
    if (payment.status === "paid") {
      // Idempotence — už zpracováno.
      return Response.json({ received: true });
    }

    await db
      .update(payments)
      .set({
        status: "paid",
        paidAt: new Date(),
        externalId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId));

    if (payment.userId) {
      try {
        await applyPaymentEffect({
          product: payment.product as ProductKind,
          userId: payment.userId,
          listingId: payment.listingId,
        });
      } catch (err) {
        console.error("[stripe webhook] apply-effect failed", err);
      }
    } else {
      console.warn(
        `[stripe webhook] payment ${paymentId} má userId=null — skip apply-effect`,
      );
    }

    try {
      await issueReceiptForPayment(paymentId);
    } catch (err) {
      console.error("[stripe webhook] issue-receipt failed", err);
    }

    return Response.json({ received: true });
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const paymentId =
      session.client_reference_id ??
      (session.metadata?.paymentId as string | undefined);
    if (paymentId) {
      await db
        .update(payments)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(payments.id, paymentId));
    }
    return Response.json({ received: true });
  }

  return Response.json({ received: true });
}
