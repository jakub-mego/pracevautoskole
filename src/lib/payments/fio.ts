import "server-only";
import { z } from "zod";

export type FioInstructions = {
  accountNumberCz: string;
  iban: string;
  bic: string;
  amountCzk: number;
  variableSymbol: string;
  message: string;
};

export function getFioInstructions(input: {
  amountCzk: number;
  variableSymbol: string;
  message: string;
}): FioInstructions {
  const account =
    process.env.FIO_ACCOUNT_NUMBER_CZ ?? "[doplnit FIO_ACCOUNT_NUMBER_CZ]";
  const iban = process.env.FIO_ACCOUNT_IBAN ?? "[doplnit FIO_ACCOUNT_IBAN]";
  const bic = process.env.FIO_ACCOUNT_BIC ?? "FIOBCZPPXXX";
  return {
    accountNumberCz: account,
    iban,
    bic,
    amountCzk: input.amountCzk,
    variableSymbol: input.variableSymbol,
    message: input.message,
  };
}

export function isFioConfigured(): boolean {
  return Boolean(
    process.env.FIO_API_TOKEN && process.env.FIO_ACCOUNT_NUMBER_CZ,
  );
}

const FioTransactionSchema = z
  .object({
    column1: z.object({ value: z.number() }).nullable().optional(), // ID
    column2: z.object({ value: z.number() }).nullable().optional(), // Volume (kladné = příjem)
    column5: z
      .object({ value: z.union([z.string(), z.number()]) })
      .nullable()
      .optional(), // Variabilní symbol
    column22: z
      .object({ value: z.number() })
      .nullable()
      .optional(), // ID pohybu
  })
  .passthrough();

const FioResponseSchema = z.object({
  accountStatement: z.object({
    info: z.object({}).passthrough(),
    transactionList: z
      .object({
        transaction: z.array(FioTransactionSchema).optional(),
      })
      .nullable()
      .optional(),
  }),
});

export type FioMatch = {
  variableSymbol: string;
  amountCzk: number;
  fioMoveId: string;
};

/**
 * Stáhne nové transakce od posledního volání (Fio "last" endpoint je kurzor-based).
 * Vrací pouze příjmy s VS.
 */
export async function fetchNewFioCredits(): Promise<FioMatch[]> {
  const token = process.env.FIO_API_TOKEN;
  if (!token) {
    throw new Error("FIO_API_TOKEN není nastaven.");
  }
  const url = `https://fioapi.fio.cz/v1/rest/last/${token}/transactions.json`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Fio API: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const parsed = FioResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Fio API: neznámý formát odpovědi");
  }
  const txs = parsed.data.accountStatement.transactionList?.transaction ?? [];
  const out: FioMatch[] = [];
  for (const t of txs) {
    const amount = t.column2?.value ?? 0;
    const vs = t.column5?.value;
    const moveId = t.column22?.value ?? t.column1?.value;
    if (amount <= 0) continue; // jen příjmy
    if (!vs) continue;
    if (!moveId) continue;
    out.push({
      variableSymbol: String(vs),
      amountCzk: Math.round(amount),
      fioMoveId: String(moveId),
    });
  }
  return out;
}

/**
 * Posune Fio kurzor (last endpoint) na konkrétní ID, aby se transakce
 * neopakovaly. Volá se po úspěšném zpracování.
 */
export async function setFioCursor(lastId: string): Promise<void> {
  const token = process.env.FIO_API_TOKEN;
  if (!token) return;
  const url = `https://fioapi.fio.cz/v1/rest/set-last-id/${token}/${encodeURIComponent(lastId)}/`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.warn(`Fio set-last-id selhalo: ${res.status}`);
  }
}
