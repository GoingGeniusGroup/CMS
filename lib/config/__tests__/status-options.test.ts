import { describe, it, expect } from "vitest";
import { STATUS_MODULES, DEFAULT_STATUS_OPTIONS } from "@/lib/config/status-options";

describe("status-options", () => {
  it("has a status list for every declared module", () => {
    for (const moduleKey of STATUS_MODULES) {
      expect(DEFAULT_STATUS_OPTIONS[moduleKey]).toBeDefined();
      expect(DEFAULT_STATUS_OPTIONS[moduleKey].length).toBeGreaterThan(0);
    }
  });

  it("every module has exactly one default status", () => {
    for (const [moduleKey, seeds] of Object.entries(DEFAULT_STATUS_OPTIONS)) {
      const defaults = seeds.filter((s) => s.isDefault);
      expect(defaults.length, `module "${moduleKey}" default count`).toBe(1);
    }
  });

  it("every status value is non-empty and every color is a valid hex code", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const seeds of Object.values(DEFAULT_STATUS_OPTIONS)) {
      for (const seed of seeds) {
        expect(seed.statusValue.length).toBeGreaterThan(0);
        expect(seed.color).toMatch(hexPattern);
      }
    }
  });

  it("no module has duplicate status values", () => {
    for (const [moduleKey, seeds] of Object.entries(DEFAULT_STATUS_OPTIONS)) {
      const values = seeds.map((s) => s.statusValue);
      expect(new Set(values).size, `module "${moduleKey}" duplicates`).toBe(values.length);
    }
  });
});
