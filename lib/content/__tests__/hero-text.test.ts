import { describe, it, expect } from "vitest";
import { splitHighlight } from "@/lib/content/hero-text";

describe("splitHighlight", () => {
  it("splits a line around the highlighted phrase", () => {
    const result = splitHighlight("Build Smarter, Scale Faster", "Smarter");
    expect(result).toEqual({ before: "Build ", match: "Smarter", after: ", Scale Faster" });
  });

  it("returns null when no highlight is given", () => {
    expect(splitHighlight("Build Smarter", undefined)).toBeNull();
    expect(splitHighlight("Build Smarter", "")).toBeNull();
  });

  it("returns null when the highlight doesn't appear in the line", () => {
    expect(splitHighlight("Build Smarter", "Nowhere")).toBeNull();
  });

  it("highlights only the first occurrence when the phrase repeats", () => {
    // This is the behavior `.split(highlight)` would get wrong: splitting on
    // every occurrence produces a 3+ element array, and naively destructuring
    // [before, after] from it silently drops everything after the second
    // occurrence. indexOf-based slicing avoids that class of bug entirely.
    const result = splitHighlight("Build Smarter, Build Faster", "Build");
    expect(result).toEqual({ before: "", match: "Build", after: " Smarter, Build Faster" });
  });

  it("handles the highlight being the entire line", () => {
    expect(splitHighlight("Build Smarter", "Build Smarter")).toEqual({
      before: "",
      match: "Build Smarter",
      after: "",
    });
  });

  it("handles the highlight at the very end of the line", () => {
    expect(splitHighlight("Scale Faster", "Faster")).toEqual({
      before: "Scale ",
      match: "Faster",
      after: "",
    });
  });
});
