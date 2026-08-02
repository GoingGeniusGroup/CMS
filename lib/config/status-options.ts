export type StatusOptionSeed = {
  statusValue: string;
  label?: string;
  color: string;
  isDefault?: boolean;
};

export const STATUS_MODULES = [
  "project",
  "blog",
  "invoice",
  "customer",
  "team",
  "service",
  "category",
  "page",
  "job",
  "applicant",
  "faq",
] as const;

/**
 * The current hardcoded status values per module, used both to seed the
 * `statusOption` table and as the runtime fallback when no status options
 * have been configured yet. Colors mirror the Tailwind palette used by the
 * existing badge classes so the UI looks the same before/after seeding.
 */
export const DEFAULT_STATUS_OPTIONS: Record<string, StatusOptionSeed[]> = {
  project: [
    { statusValue: "Published", color: "#16a34a" },
    { statusValue: "Draft", color: "#dc2626", isDefault: true },
  ],
  blog: [
    { statusValue: "Published", color: "#16a34a" },
    { statusValue: "Draft", color: "#dc2626", isDefault: true },
  ],
  invoice: [
    { statusValue: "Paid", color: "#16a34a" },
    { statusValue: "Pending", color: "#d97706", isDefault: true },
    { statusValue: "Overdue", color: "#dc2626" },
  ],
  customer: [
    { statusValue: "Active", color: "#16a34a", isDefault: true },
    { statusValue: "Inactive", color: "#dc2626" },
  ],
  team: [
    { statusValue: "Active", color: "#16a34a", isDefault: true },
    { statusValue: "Inactive", color: "#6b7280" },
  ],
  service: [
    { statusValue: "Active", color: "#16a34a", isDefault: true },
    { statusValue: "Inactive", color: "#dc2626" },
  ],
  category: [
    { statusValue: "Active", color: "#059669", isDefault: true },
    { statusValue: "Draft", color: "#d97706" },
    { statusValue: "Inactive", color: "#dc2626" },
  ],
  page: [
    { statusValue: "Published", color: "#16a34a" },
    { statusValue: "Draft", color: "#d97706", isDefault: true },
  ],
  job: [
    { statusValue: "Active", color: "#16a34a", isDefault: true },
    { statusValue: "Inactive", color: "#dc2626" },
  ],
  applicant: [
    { statusValue: "Submitted", color: "#2563eb", isDefault: true },
    { statusValue: "Reviewing", color: "#d97706" },
    { statusValue: "Shortlisted", color: "#9333ea" },
    { statusValue: "Interviewed", color: "#4f46e5" },
    { statusValue: "Offered", color: "#16a34a" },
    { statusValue: "Rejected", color: "#e11d48" },
  ],
  faq: [
    { statusValue: "Active", color: "#16a34a", isDefault: true },
  ],
};
