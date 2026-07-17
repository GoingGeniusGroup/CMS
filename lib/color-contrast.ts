/**
 * Color contrast helpers for the theme system.
 *
 * Given a background (theme) color, we compute which foreground text color
 * (black or white) is most readable on top of it, using the WCAG relative
 * luminance formula. This powers the "recommended text color" suggestion in
 * General Settings so text is always legible on the theme-colored surfaces.
 */

/** Parse a #rgb or #rrggbb hex string into [r, g, b] (0-255). Returns null if invalid. */
export function parseHex(hex: string): [number, number, number] | null {
  if (!hex) return null;
  let c = hex.trim().replace(/^#/, "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(c)) return null;
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Returns the most readable text color ("#000000" or "#ffffff") to place on top
 * of the given background color, whichever yields the higher WCAG contrast ratio.
 * Near-white backgrounds resolve to black; dark/saturated backgrounds to white.
 */
export function getReadableTextColor(backgroundHex: string): string {
  const L = relativeLuminance(backgroundHex);
  const contrastWithWhite = 1.05 / (L + 0.05);
  const contrastWithBlack = (L + 0.05) / 0.05;
  return contrastWithBlack >= contrastWithWhite ? "#000000" : "#ffffff";
}
