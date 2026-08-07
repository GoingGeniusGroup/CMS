/**
 * Supplies configured brand variables for both resolved UI modes. The theme
 * mode itself is owned by ThemeModeProvider, which toggles `html.light` and
 * `html.dark` before paint.
 */
type ThemeProviderProps = {
  lightThemeColor: string;
  lightThemeTextColor: string;
  darkThemeColor: string;
  darkThemeTextColor: string;
  hoverColor?: string;
  hoverEnabled?: boolean;
  baseColorEnabled: boolean;
};

const FAMILIES = ["indigo", "purple"];
const SOLID_SHADES = ["400", "500", "600", "700", "800", "900"];

function selector(prefix: string, suffix = "") {
  return FAMILIES.flatMap((family) =>
    SOLID_SHADES.map((shade) => `html body [class*="${prefix}-${family}-${shade}"]${suffix}`)
  ).join(",\n    ");
}

export function ThemeProvider({
  lightThemeColor,
  lightThemeTextColor,
  darkThemeColor,
  darkThemeTextColor,
  hoverColor,
  hoverEnabled = true,
  baseColorEnabled,
}: ThemeProviderProps) {
  if (!baseColorEnabled) return null;

  const hover = hoverEnabled && hoverColor ? hoverColor : undefined;
  const css = `
    :root, html.light {
      --theme-color: ${lightThemeColor};
      --theme-text-color: ${lightThemeTextColor};
      --theme-color-hover: ${hover ?? lightThemeColor};
      --theme-color-light: ${lightThemeColor}12;
      --theme-color-medium: ${lightThemeColor}25;
    }
    html.dark {
      --theme-color: ${darkThemeColor};
      --theme-text-color: ${darkThemeTextColor};
      --theme-color-hover: ${hover ?? darkThemeColor};
      --theme-color-light: ${darkThemeColor}20;
      --theme-color-medium: ${darkThemeColor}40;
    }
    ${selector("bg")} { background-color: var(--theme-color) !important; color: var(--theme-text-color) !important; }
    ${selector("bg", " svg")} { color: var(--theme-text-color) !important; }
    ${selector("text")} { color: var(--theme-color) !important; }
    html body [class*="border-indigo-"], html body [class*="border-purple-"] { border-color: var(--theme-color-medium) !important; }
    html body [class*="shadow-indigo-"], html body [class*="shadow-purple-"] { --tw-shadow-color: var(--theme-color-medium) !important; }
    html body [class~="bg-indigo-50"], html body [class~="bg-purple-50"],
    html body [class~="bg-indigo-100"], html body [class~="bg-purple-100"],
    html body [class~="bg-indigo-200"], html body [class~="bg-purple-200"],
    html body [class~="bg-indigo-300"], html body [class~="bg-purple-300"] {
      background-color: var(--theme-color-light) !important;
    }
    html body [class~="text-indigo-200"], html body [class~="text-purple-200"],
    html body [class~="text-indigo-300"], html body [class~="text-purple-300"],
    html body [class~="text-indigo-100"], html body [class~="text-purple-100"],
    html body [class~="text-indigo-50"], html body [class~="text-purple-50"] { color: var(--theme-color-medium) !important; }
    html body [class*="from-indigo-"], html body [class*="from-purple-"] { --tw-gradient-from: var(--theme-color) !important; }
    html body [class*="to-indigo-"], html body [class*="to-purple-"] { --tw-gradient-to: var(--theme-color) !important; }
    html body [class*="via-indigo-"], html body [class*="via-purple-"] { --tw-gradient-via: var(--theme-color) !important; }
    html body [class*="ring-indigo-"], html body [class*="ring-purple-"] { --tw-ring-color: var(--theme-color-medium) !important; }
    html body [class*="hover:bg-indigo"]:hover, html body [class*="hover:bg-purple"]:hover { background-color: var(--theme-color-hover) !important; }
    html body [class*="hover:text-indigo"]:hover, html body [class*="hover:text-purple"]:hover { color: var(--theme-color-hover) !important; }
    html body [class~="hover:bg-indigo-50"]:hover, html body [class~="hover:bg-purple-50"]:hover,
    html body [class~="hover:bg-indigo-100"]:hover, html body [class~="hover:bg-purple-100"]:hover,
    html body [class~="hover:bg-indigo-200"]:hover, html body [class~="hover:bg-purple-200"]:hover,
    html body [class~="hover:bg-indigo-300"]:hover, html body [class~="hover:bg-purple-300"]:hover { background-color: var(--theme-color-light) !important; }
    html body [class~="hover:text-indigo-200"]:hover, html body [class~="hover:text-purple-200"]:hover,
    html body [class~="hover:text-indigo-300"]:hover, html body [class~="hover:text-purple-300"]:hover { color: var(--theme-color-medium) !important; }
    .theme-bg { background-color: var(--theme-color); color: var(--theme-text-color); }
    .theme-bg svg { color: var(--theme-text-color); }
    .theme-bg-hover:hover { background-color: var(--theme-color-hover); }
    .theme-text { color: var(--theme-color); }
    .theme-text-on { color: var(--theme-text-color); }
    .theme-border { border-color: var(--theme-color); }
    .theme-bg-light { background-color: var(--theme-color-light); }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
