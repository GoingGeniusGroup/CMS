import { describe, it, expect } from "vitest";
import {
  SECTION_REGISTRY,
  heroSchema,
  sectionHeaderSchema,
  cardsSchema,
  parseSectionData,
  type SectionKey,
} from "@/lib/content/schemas";

// Maps each schema to the `kind` every entry using it must declare. The
// editor (Phase 17) dispatches forms purely off `entry.kind`, cast through
// `as never` since TS can't correlate a runtime `kind` check with which
// concrete data type a generic SectionKey resolves to — so a mismatched
// `kind` here would silently render the wrong form for a section's actual
// data shape, with no compile-time signal. This test is the safety net.
const EXPECTED_KIND_BY_SCHEMA = new Map<unknown, string>([
  [heroSchema, "hero"],
  [sectionHeaderSchema, "sectionHeader"],
  [cardsSchema, "cards"],
]);

const sectionKeys = Object.keys(SECTION_REGISTRY) as SectionKey[];

describe("SECTION_REGISTRY", () => {
  it("every entry's default payload parses against its own schema", () => {
    for (const key of sectionKeys) {
      const entry = SECTION_REGISTRY[key];
      const result = entry.schema.safeParse(entry.defaultData);
      expect(result.success, `${key} default data: ${JSON.stringify(result.success ? null : result.error?.issues)}`).toBe(true);
    }
  });

  it("every entry has a non-empty pageKey and label", () => {
    for (const key of sectionKeys) {
      const entry = SECTION_REGISTRY[key];
      expect(entry.pageKey.length).toBeGreaterThan(0);
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });

  it("defaultOrder is unique within each page (no accidental collisions)", () => {
    const byPage = new Map<string, number[]>();
    for (const key of sectionKeys) {
      const entry = SECTION_REGISTRY[key];
      const orders = byPage.get(entry.pageKey) ?? [];
      orders.push(entry.defaultOrder);
      byPage.set(entry.pageKey, orders);
    }
    for (const [pageKey, orders] of byPage) {
      expect(new Set(orders).size, `page "${pageKey}" has duplicate defaultOrder values`).toBe(orders.length);
    }
  });

  it("section keys are namespaced as pageKey.sectionName", () => {
    for (const key of sectionKeys) {
      const entry = SECTION_REGISTRY[key];
      expect(key.startsWith(`${entry.pageKey}.`)).toBe(true);
    }
  });

  it("every entry's declared kind matches the schema it actually uses", () => {
    for (const key of sectionKeys) {
      const entry = SECTION_REGISTRY[key];
      const expectedKind = EXPECTED_KIND_BY_SCHEMA.get(entry.schema);
      expect(expectedKind, `"${key}" uses an unrecognized schema`).toBeDefined();
      expect(entry.kind, `"${key}" kind/schema mismatch`).toBe(expectedKind);
    }
  });
});

describe("sectionHeaderSchema", () => {
  it("requires a heading", () => {
    expect(sectionHeaderSchema.safeParse({}).success).toBe(false);
    expect(sectionHeaderSchema.safeParse({ heading: "Hi" }).success).toBe(true);
  });

  it("rejects a ctaHref that isn't a path, anchor, or full URL", () => {
    expect(sectionHeaderSchema.safeParse({ heading: "Hi", ctaHref: "javascript:alert(1)" }).success).toBe(false);
    expect(sectionHeaderSchema.safeParse({ heading: "Hi", ctaHref: "/our-services" }).success).toBe(true);
    expect(sectionHeaderSchema.safeParse({ heading: "Hi", ctaHref: "#contact" }).success).toBe(true);
    expect(sectionHeaderSchema.safeParse({ heading: "Hi", ctaHref: "https://example.com" }).success).toBe(true);
  });
});

describe("heroSchema", () => {
  it("requires at least one heading line and caps at four", () => {
    expect(heroSchema.safeParse({ headingLines: [] }).success).toBe(false);
    expect(heroSchema.safeParse({ headingLines: ["One"] }).success).toBe(true);
    expect(
      heroSchema.safeParse({ headingLines: ["1", "2", "3", "4", "5"] }).success
    ).toBe(false);
  });
});

describe("cardsSchema", () => {
  it("requires a title on every item but tolerates a missing description", () => {
    expect(
      cardsSchema.safeParse({ items: [{ id: "a", title: "A" }] }).success
    ).toBe(true);
    expect(
      cardsSchema.safeParse({ items: [{ id: "a" }] }).success
    ).toBe(false);
  });

  it("caps items at 24 to keep the editor and grid sane", () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: `${i}`, title: `Item ${i}` }));
    expect(cardsSchema.safeParse({ items }).success).toBe(false);
  });
});

describe("parseSectionData — fallback-on-invalid behavior", () => {
  it("returns the parsed value when data is valid", () => {
    const result = parseSectionData("shared.faq", { heading: "Custom Heading" });
    expect(result.heading).toBe("Custom Heading");
  });

  it("falls back to the registry default when data is invalid, instead of throwing", () => {
    const result = parseSectionData("shared.faq", { heading: "" }); // fails min(1)
    expect(result).toEqual(SECTION_REGISTRY["shared.faq"].defaultData);
  });

  it("falls back to the registry default when data is missing required fields entirely", () => {
    const result = parseSectionData("home.hero", { subheading: "only this" });
    expect(result).toEqual(SECTION_REGISTRY["home.hero"].defaultData);
  });
});
