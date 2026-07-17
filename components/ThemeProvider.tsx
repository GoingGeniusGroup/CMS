/**
 * ThemeProvider — injects CSS custom properties and overrides for the CMS theme color.
 *
 * - `themeColor`: the single base color applied to SOLID indigo/purple utilities (shades 400–900).
 *   Light tints (50/100/200/300) are intentionally left untouched so tinted badges/cards
 *   keep their pale backgrounds and remain readable.
 * - `themeTextColor`: the foreground text color used on top of themed (solid) backgrounds
 *   (buttons, badges, banners) — applied to text AND icons so they stay legible.
 * - `hoverColor`: applied on :hover states only, when `hoverEnabled` is true.
 * - `hoverEnabled`: when false, hover keeps the base theme color (no color change).
 * - `baseColorEnabled`: master switch to enable/disable theming entirely.
 *
 * NOTE: This is only mounted on the public (client-facing) site, NOT the admin panel.
 */

type ThemeProviderProps = {
  themeColor: string;
  themeTextColor?: string;
  hoverColor?: string;
  hoverEnabled?: boolean;
  baseColorEnabled: boolean;
};

const FAMILIES = ["indigo", "purple"];
// Only SOLID shades are themed — light tints (50/100/200/300) are preserved.
const SOLID_SHADES = ["400", "500", "600", "700", "800", "900"];

function sel(prefix: string, suffix = "") {
  return FAMILIES.flatMap((f) =>
    SOLID_SHADES.map((s) => `html body [class*="${prefix}-${f}-${s}"]${suffix}`)
  ).join(",\n    ");
}

export function ThemeProvider({
  themeColor,
  themeTextColor = "#ffffff",
  hoverColor,
  hoverEnabled = true,
  baseColorEnabled,
}: ThemeProviderProps) {
  if (!baseColorEnabled || !themeColor) return null;

  // Hover uses the hover color only when enabled; otherwise it stays the theme color.
  const hover = hoverEnabled && hoverColor ? hoverColor : themeColor;
  const textOnTheme = themeTextColor || "#ffffff";

  const css = `
    :root {
      --theme-color: ${themeColor};
      --theme-color-hover: ${hover};
      --theme-color-light: ${themeColor}12;
      --theme-color-medium: ${themeColor}25;
      --theme-text-color: ${textOnTheme};
    }

    /* ─── Solid themed backgrounds (shades 400–900 only) → theme color.
       Their text + icons use the on-theme text color for legibility. ─── */
    ${sel("bg")} {
      background-color: ${themeColor} !important;
      color: ${textOnTheme} !important;
    }
    ${sel("bg", " [class*=\"text-white\"]")},
    ${sel("bg", " svg")} {
      color: ${textOnTheme} !important;
    }

    /* ─── Themed text (solid shades) → theme color ─── */
    ${sel("text")} {
      color: ${themeColor} !important;
    }

    /* ─── Borders ─── */
    html body [class*="border-indigo-"],
    html body [class*="border-purple-"] {
      border-color: ${themeColor}40 !important;
    }

    /* ─── Gradients ─── */
    html body [class*="from-indigo-"],
    html body [class*="from-purple-"] {
      --tw-gradient-from: ${themeColor} !important;
    }
    html body [class*="to-indigo-"],
    html body [class*="to-purple-"] {
      --tw-gradient-to: ${themeColor} !important;
    }
    html body [class*="via-indigo-"],
    html body [class*="via-purple-"] {
      --tw-gradient-via: ${themeColor} !important;
    }

    /* ─── Rings ─── */
    html body [class*="ring-indigo-"],
    html body [class*="ring-purple-"] {
      --tw-ring-color: ${themeColor}40 !important;
    }

    /* ─── Focus states ─── */
    html body [class*="focus:border-indigo"]:focus,
    html body [class*="focus:ring-indigo"]:focus {
      border-color: ${themeColor} !important;
      --tw-ring-color: ${themeColor}30 !important;
    }

    /* ─── Hover states: use hover color (or theme color when hover disabled) ─── */
    html body [class*="hover:bg-indigo"]:hover,
    html body [class*="hover:bg-purple"]:hover {
      background-color: ${hover} !important;
    }
    html body [class*="hover:text-indigo"]:hover,
    html body [class*="hover:text-purple"]:hover {
      color: ${hover} !important;
    }

    /* ─── Theme utility classes ─── */
    .theme-bg { background-color: ${themeColor}; color: ${textOnTheme}; }
    .theme-bg svg { color: ${textOnTheme}; }
    .theme-bg-hover:hover { background-color: ${hover}; }
    .theme-text { color: ${themeColor}; }
    .theme-text-on { color: ${textOnTheme}; }
    .theme-border { border-color: ${themeColor}; }
    .theme-bg-light { background-color: ${themeColor}12; }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
