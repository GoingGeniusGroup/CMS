export const ENTITY_KEYS = [
  "customer",
  "project",
  "service",
  "team",
  "invoice",
  "blog",
  "job",
  "applicant",
  "category",
  "page",
  "faq",
  "lead",
] as const;

export type EntityKey = (typeof ENTITY_KEYS)[number];

export type EntityLabels = { singular: string; plural: string };

export const DEFAULT_ENTITY_LABELS: Record<EntityKey, EntityLabels> = {
  customer: { singular: "Customer", plural: "Customers" },
  project: { singular: "Project", plural: "Projects" },
  service: { singular: "Service", plural: "Services" },
  team: { singular: "Team", plural: "Team Members" },
  invoice: { singular: "Invoice", plural: "Invoices" },
  blog: { singular: "Blog", plural: "Blogs" },
  job: { singular: "Vacancy", plural: "Vacancies" },
  applicant: { singular: "Applicant", plural: "Applicants" },
  category: { singular: "Category", plural: "Categories" },
  page: { singular: "Page", plural: "Pages" },
  faq: { singular: "FAQ", plural: "FAQs" },
  lead: { singular: "Lead", plural: "Leads" },
};
