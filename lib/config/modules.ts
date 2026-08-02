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
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];
