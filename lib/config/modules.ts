export const MODULE_KEYS = [
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

export type ModuleKey = (typeof MODULE_KEYS)[number];
