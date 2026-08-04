import { describe, it, expect } from "vitest";
import {
  INDUSTRY_PROFILE_NAMES,
  INDUSTRY_PROFILES,
  getProfileConfig,
  isCustomProfile,
  CUSTOM_PROFILE,
} from "@/lib/config/industry-profiles";

describe("industry-profiles", () => {
  it("has a config entry for every declared profile name except none missing", () => {
    for (const name of INDUSTRY_PROFILE_NAMES) {
      expect(INDUSTRY_PROFILES[name]).toBeDefined();
    }
  });

  it("returns the Generic config for an unknown profile name", () => {
    const config = getProfileConfig("Some Made Up Industry");
    expect(config).toBe(INDUSTRY_PROFILES.Generic);
  });

  it("returns the exact config for a known profile", () => {
    const config = getProfileConfig("Healthcare");
    expect(config.labels?.customer?.singular).toBe("Patient");
  });

  it("identifies the Custom profile correctly", () => {
    expect(isCustomProfile(CUSTOM_PROFILE)).toBe(true);
    expect(isCustomProfile("Generic")).toBe(false);
    expect(isCustomProfile("Healthcare")).toBe(false);
  });

  it("Custom profile has no preset labels or custom fields", () => {
    const config = getProfileConfig(CUSTOM_PROFILE);
    expect(Object.keys(config.labels ?? {})).toHaveLength(0);
    expect(Object.keys(config.customFields ?? {})).toHaveLength(0);
  });

  it("every suggested custom field has a non-empty fieldKey and label", () => {
    for (const [profileName, config] of Object.entries(INDUSTRY_PROFILES)) {
      for (const [moduleKey, fields] of Object.entries(config.customFields ?? {})) {
        for (const field of fields) {
          expect(field.fieldKey.length, `${profileName}/${moduleKey} fieldKey`).toBeGreaterThan(0);
          expect(field.label.length, `${profileName}/${moduleKey} label`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("dropdown-type suggested fields always declare options", () => {
    for (const config of Object.values(INDUSTRY_PROFILES)) {
      for (const fields of Object.values(config.customFields ?? {})) {
        for (const field of fields) {
          if (field.type === "dropdown") {
            expect(field.options && field.options.length > 0).toBe(true);
          }
        }
      }
    }
  });
});
