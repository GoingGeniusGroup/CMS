import { describe, it, expect } from "vitest";
import { ENTITY_KEYS, DEFAULT_ENTITY_LABELS } from "@/lib/config/entity-labels";

describe("entity-labels", () => {
  it("has a default label entry for every declared entity key", () => {
    for (const key of ENTITY_KEYS) {
      expect(DEFAULT_ENTITY_LABELS[key]).toBeDefined();
      expect(DEFAULT_ENTITY_LABELS[key].singular.length).toBeGreaterThan(0);
      expect(DEFAULT_ENTITY_LABELS[key].plural.length).toBeGreaterThan(0);
    }
  });

  it("does not have stray label entries for undeclared keys", () => {
    const declared = new Set<string>(ENTITY_KEYS);
    for (const key of Object.keys(DEFAULT_ENTITY_LABELS)) {
      expect(declared.has(key)).toBe(true);
    }
  });
});
