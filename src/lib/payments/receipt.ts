import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/client";
import { paymentReceiptEmail } from "@/lib/email/templates";
import { getProduct } from "./products";
import { payments, users } from "../../../drizzle/schema";

function generateReceiptNumber(): string {
  // Formát "YYYY-XXXXXXXX" — rok + 8 hex znaků z UUID. Unikátní per účetní rok.
  const year = new Date().getFullYear();
  const hex = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .toUpperCase()
    .padStart(8, "0");
  return `${year}-${hex}`;
}

/**
 * Po confirmed platbě:
 *   1) přiřadí číslo dokladu (idempotentně — pokud už je, použije existující)
 *   2) pošle uživateli e-mailem doklad
 * Volá se ze Stripe webhook + Fio polling.
 */
export async function issueReceiptForPayment(paymentId: string) {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1);
  const payment = rows[0];
  if (!payment) return { skipped: "payment not found" };
  if (payment.status !== "paid") return { skipped: "not paid" };
  if (!payment.userId) return { skipped: "anonymized — no recipient" };

  const userRows = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, payment.userId))
    .limit(1);
  const user = userRows[0];
  if (!user) return { skipped: "user not found" };

  // Idempotence: pokud už receiptNumber existuje, neposílej znovu.
  let receiptNumber = payment.receiptNumber;
  if (!receiptNumber) {
    // Reroll na kolizi (extrémně nepravděpodobné).
    for (let attempt = 0; attempt < 3; attempt++) {
      const candidate = generateReceiptNumber();
      try {
        await db
          .update(payments)
          .set({ receiptNumber: candidate, updatedAt: new Date() })
          .where(eq(payments.id, paymentId));
        receiptNumber = candidate;
        break;
      } catch (err) {
        // Unikátní index na receipt_number → kolize, zkusit znovu.
        if (attempt === 2) throw err;
      }
    }
  } else {
    return { skipped: "receipt already issued", receiptNumber };
  }

  if (!receiptNumber) {
    return { skipped: "could not allocate receipt number" };
  }

  const product = getProduct(payment.product as never);
  const tpl = paymentReceiptEmail({
    name: user.name ?? null,
    receiptNumber,
    paidAt: payment.paidAt ?? new Date(),
    productName: product.name,
    amountCzk: payment.amountCzk,
    paymentMethod:
      payment.provider === "stripe"
        ? "Karta (Stripe)"
        : "Bankovní převod (Fio)",
    variableSymbol: payment.variableSymbol,
    externalId: payment.externalId,
  });
  await sendEmail({ to: user.email, ...tpl });

  return { receiptNumber, sent: true };
}
