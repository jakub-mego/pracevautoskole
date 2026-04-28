import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { payments } from "../../../drizzle/schema";

export async function listPaymentsByUser(userId: string) {
  return db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
}

export async function getPaymentById(id: string) {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPaymentByIdAndUser(id: string, userId: string) {
  const rows = await db
    .select()
    .from(payments)
    .where(and(eq(payments.id, id), eq(payments.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPendingFioByVariableSymbol(vs: string) {
  const rows = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.variableSymbol, vs),
        eq(payments.provider, "fio"),
        eq(payments.status, "pending"),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function generateUniqueVariableSymbol(): Promise<string> {
  // 10-místný numerický VS. Reroll při kolizi (extrémně nepravděpodobné).
  for (let i = 0; i < 5; i++) {
    const candidate = String(
      Math.floor(1_000_000_000 + Math.random() * 9_000_000_000),
    );
    const existing = await db
      .select({ id: payments.id })
      .from(payments)
      .where(eq(payments.variableSymbol, candidate))
      .limit(1);
    if (!existing[0]) return candidate;
  }
  throw new Error("Nepodařilo se vygenerovat unikátní variabilní symbol.");
}
