export const LISTING_STATUS_LABELS = {
  draft: "Koncept",
  pending_payment: "Čeká na platbu",
  active: "Aktivní",
  paused: "Pozastavený",
  expired: "Expirovaný",
  archived: "Archivovaný",
} as const;

export type ListingStatusKey = keyof typeof LISTING_STATUS_LABELS;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "Plný úvazek" },
  { value: "part_time", label: "Částečný úvazek" },
  { value: "contract", label: "OSVČ / smlouva o dílo" },
  { value: "agreement", label: "DPP / DPČ" },
  { value: "other", label: "Jiné / domluva" },
] as const;
