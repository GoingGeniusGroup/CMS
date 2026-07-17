/**
 * ThemeProvider — injects CSS custom properties and overrides for the CMS theme color.
 *
 * - `themeColor`: the single base color applied to ALL indigo/purple utilities (non-hover).
 * - `hoverColor`: applied on :hover states only, when `hoverEnabled` is true.
 * - `hoverEnabled`: when false, hover keeps the base theme color (no color change).
 * - `baseColorEnabled`: master switch to enable/disable theming entirely.
 */

type ThemeProviderProps = {
  themeColor: string;
  hoverColor?: string;
  hoverEnabled?: boolean;
  baseColorEnabled: boolean;
};

export function ThemeProvider({
  themeColor,
  hoverColor,
  hoverEnabled = true,
  baseColorEnabled,
}: ThemeProviderProps) {
  if (!baseColorEnabled || !themeColor) return null;

  // Hover uses the hover color only when enabled; otherwise it stays the theme color.
  const hover = hoverEnabled && hoverColor ? hoverColor : themeColor;

  const css = `
    :root {
      --theme-color: ${themeColor};
      --theme-color-hover: ${hover};
      --theme-color-light: ${themeColor}12;
      --theme-color-medium: ${themeColor}25;
    }

    /* ─── Background: ALL solid indigo/purple shades → theme color (uniform, no mix) ─── */
    html body [class*="bg-indigo-4"],
    html body [class*="bg-indigo-5"],
    html body [class*="bg-indigo-6"],
    html body [class*="bg-indigo-7"],
    html body [class*="bg-indigo-8"],
    html body [class*="bg-indigo-9"],
    html body [class*="bg-purple-4"],
    html body [class*="bg-purple-5"],
    html body [class*="bg-purple-6"],
    html body [class*="bg-purple-7"],
    html body [class*="bg-purple-8"],
    html body [class*="bg-purple-9"] {
      background-color: ${themeColor} !important;
    }

    /* ─── Light tint backgrounds (50/100) → do NOT override, keep original light tints ─── */

    /* ─── Text: all indigo/purple shades → theme color ─── */
    html body [class*="text-indigo-4"],
    html body [class*="text-indigo-5"],
    html body [class*="text-indigo-6"],
    html body [class*="text-indigo-7"],
    html body [class*="text-indigo-8"],
    html body [class*="text-indigo-9"],
    html body [class*="text-purple-4"],
    html body [class*="text-purple-5"],
    html body [class*="text-purple-6"],
    html body [class*="text-purple-7"],
    html body [class*="text-purple-8"],
    html body [class*="text-purple-9"] {
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
    /* Apply hover color to themed text links on hover (even without explicit hover:text class) */
    html body [class*="text-indigo-6"]:hover,
    html body [class*="text-indigo-5"]:hover,
    html body [class*="text-purple-6"]:hover {
      color: ${hover} !important;
    }

    /* ─── Theme utility classes ─── */
    .theme-bg { background-color: ${themeColor}; }
    .theme-bg-hover:hover { background-color: ${hover}; }
    .theme-text { color: ${themeColor}; }
    .theme-border { border-color: ${themeColor}; }
    .theme-bg-light { background-color: ${themeColor}12; }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
