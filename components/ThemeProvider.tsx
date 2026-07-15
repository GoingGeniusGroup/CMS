/**
 * ThemeProvider — injects CSS custom properties and overrides for the CMS theme color.
 * Uses high-specificity selectors to override Tailwind v4 utilities.
 */

type ThemeProviderProps = {
  themeColor: string;
  baseColorEnabled: boolean;
};

export function ThemeProvider({ themeColor, baseColorEnabled }: ThemeProviderProps) {
  if (!baseColorEnabled || !themeColor) return null;

  const hover = adjustBrightness(themeColor, -12);

  // Use html body selectors for maximum specificity that beats Tailwind v4
  const css = `
    :root {
      --theme-color: ${themeColor};
      --theme-color-hover: ${hover};
      --theme-color-light: ${themeColor}12;
      --theme-color-medium: ${themeColor}25;
    }

    /* ─── Background overrides ─── */
    html body [class*="bg-indigo-6"],
    html body [class*="bg-purple-6"] {
      background-color: ${themeColor} !important;
    }
    html body [class*="bg-indigo-7"],
    html body [class*="bg-purple-7"] {
      background-color: ${hover} !important;
    }
    html body [class*="bg-indigo-5"] {
      background-color: ${themeColor} !important;
    }
    html body [class*="bg-indigo-50"],
    html body [class*="bg-purple-50"] {
      background-color: ${themeColor}15 !important;
    }

    /* ─── Text overrides ─── */
    html body [class*="text-indigo-6"],
    html body [class*="text-purple-6"],
    html body [class*="text-purple-7"] {
      color: ${themeColor} !important;
    }
    html body [class*="text-indigo-5"],
    html body [class*="text-purple-5"] {
      color: ${themeColor} !important;
    }
    html body [class*="text-indigo-7"] {
      color: ${hover} !important;
    }
    html body [class*="text-indigo-4"] {
      color: ${themeColor} !important;
    }

    /* ─── Border overrides ─── */
    html body [class*="border-indigo-"],
    html body [class*="border-purple-"] {
      border-color: ${themeColor}40 !important;
    }

    /* ─── Gradient overrides ─── */
    html body [class*="from-indigo-"] {
      --tw-gradient-from: ${themeColor} !important;
    }
    html body [class*="to-purple-"],
    html body [class*="to-indigo-"] {
      --tw-gradient-to: ${hover} !important;
    }
    html body [class*="via-indigo-"] {
      --tw-gradient-via: ${themeColor} !important;
    }

    /* ─── Ring overrides ─── */
    html body [class*="ring-indigo-"],
    html body [class*="ring-purple-"] {
      --tw-ring-color: ${themeColor}40 !important;
    }

    /* ─── Focus state overrides ─── */
    html body [class*="focus:border-indigo"]:focus,
    html body [class*="focus:ring-indigo"]:focus {
      border-color: ${themeColor} !important;
      --tw-ring-color: ${themeColor}30 !important;
    }

    /* ─── Hover state overrides ─── */
    html body [class*="hover:bg-indigo"]:hover,
    html body [class*="hover:bg-purple"]:hover {
      background-color: ${hover} !important;
    }
    html body [class*="hover:text-indigo"]:hover,
    html body [class*="hover:text-purple"]:hover {
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

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
