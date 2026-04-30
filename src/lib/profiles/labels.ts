export const PROFESSIONAL_ROLE_LABELS = {
  instructor: "Učitel autoškoly",
  master_practice: "Mistr praktického výcviku",
  operator_admin: "Provozní / administrativa",
  lecturer_48: "Lektor 48hod. školení",
  manager: "Vedoucí / manažer",
  medic: "Lektor zdravotní přípravy",
  court_interpreter: "Soudní tlumočník",
} as const;

export type ProfessionalRoleKey = keyof typeof PROFESSIONAL_ROLE_LABELS;

export const LICENSE_CATEGORIES = [
  "AM", "A1", "A2", "A",
  "B1", "B", "BE",
  "C1", "C1E", "C", "CE",
  "D1", "D1E", "D", "DE",
  "T",
] as const;

export type LicenseCategory = (typeof LICENSE_CATEGORIES)[number];
