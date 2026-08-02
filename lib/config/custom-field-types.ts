export const CUSTOM_FIELD_TYPES = ["text", "number", "date", "dropdown", "toggle"] as const;

export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];
