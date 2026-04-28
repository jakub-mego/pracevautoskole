export const REPORT_REASON_LABELS = {
  spam: "Spam / opakující se obsah",
  inappropriate: "Vulgární / urážlivé / výhružné",
  discrimination: "Diskriminace (věk, pohlaví, etnicita …)",
  duplicate: "Duplikát existujícího inzerátu",
  out_of_scope: "Mimo obor autoškol",
  other: "Jiné",
} as const;

export type ReportReasonKey = keyof typeof REPORT_REASON_LABELS;

export const REPORT_STATUS_LABELS = {
  open: "Nevyřešeno",
  resolved: "Vyřešeno",
  dismissed: "Zamítnuto",
} as const;

export type ReportStatusKey = keyof typeof REPORT_STATUS_LABELS;
