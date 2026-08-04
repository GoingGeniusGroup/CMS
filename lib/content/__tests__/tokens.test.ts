import { describe, it, expect } from "vitest";
import { resolveTokens, resolveTokensIfPresent } from "@/lib/content/tokens";

const labels = {
  service: { singular: "Service", plural: "Services" },
  project: { singular: "Project", plural: "Projects" },
};

describe("resolveTokens", () => {
  it("resolves a plural token", () => {
    expect(resolveTokens("View All {{service.plural}}", labels)).toBe("View All Services");
  });

  it("resolves a singular token", () => {
    expect(resolveTokens("Add a {{project.singular}}", labels)).toBe("Add a Project");
  });

  it("lowercases the resolved value with the |lower flag", () => {
    expect(resolveTokens("our latest {{project.plural|lower}}", labels)).toBe("our latest projects");
  });

  it("resolves multiple tokens in one string", () => {
    expect(resolveTokens("{{service.plural}} and {{project.plural}}", labels)).toBe("Services and Projects");
  });

  it("leaves an unknown entity key's token literally unresolved, rather than throwing", () => {
    expect(resolveTokens("Explore our {{widget.plural}}", labels)).toBe("Explore our {{widget.plural}}");
  });

  it("leaves malformed tokens (bad form, missing dot) untouched", () => {
    expect(resolveTokens("{{service.other}}", labels)).toBe("{{service.other}}");
    expect(resolveTokens("{{service}}", labels)).toBe("{{service}}");
  });

  it("leaves plain text with no tokens unchanged", () => {
    expect(resolveTokens("What We Do Best", labels)).toBe("What We Do Best");
  });
});

describe("resolveTokensIfPresent", () => {
  it("behaves identically to resolveTokens when a token is present", () => {
    expect(resolveTokensIfPresent("{{service.plural}}", labels)).toBe("Services");
  });

  it("returns the input untouched when no '{{' substring exists (fast path)", () => {
    expect(resolveTokensIfPresent("Plain text", labels)).toBe("Plain text");
  });
});
