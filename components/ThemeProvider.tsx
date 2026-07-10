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

  // Use body-level selectors for high specificity that beats Tailwind v4 @layer
  const css = `
    :root {
      --theme-color: ${themeColor};
      --theme-color-hover: ${hover};
      --theme-color-light: ${themeColor}12;
      --theme-color-medium: ${themeColor}25;
    }

    /* ─── Background overrides ─── */
    body [class*="bg-indigo-6"],
    body [class*="bg-purple-6"] {
      background-color: ${themeColor} !important;
    }
    body [class*="bg-indigo-7"],
    body [class*="bg-purple-7"] {
      background-color: ${hover} !important;
    }
    body [class*="bg-indigo-5"] {
      background-color: ${themeColor} !important;
    }
    body [class*="bg-indigo-1"],
    body [class*="bg-purple-1"],
    body [class*="bg-indigo-50"],
    body [class*="bg-purple-50"] {
      background-color: ${themeColor}10 !important;
    }

    /* ─── Text overrides ─── */
    body [class*="text-indigo-6"],
    body [class*="text-purple-6"],
    body [class*="text-purple-7"] {
      color: ${themeColor} !important;
    }
    body [class*="text-indigo-5"],
    body [class*="text-purple-5"] {
      color: ${themeColor} !important;
    }
    body [class*="text-indigo-7"] {
      color: ${hover} !important;
    }

    /* ─── Border overrides ─── */
    body [class*="border-indigo-"],
    body [class*="border-purple-"] {
      border-color: ${themeColor}40 !important;
    }

    /* ─── Gradient overrides ─── */
    body [class*="from-indigo-"] {
      --tw-gradient-from: ${themeColor} !important;
    }
    body [class*="to-purple-"],
    body [class*="to-indigo-"] {
      --tw-gradient-to: ${hover} !important;
    }
    body [class*="via-indigo-"] {
      --tw-gradient-via: ${themeColor} !important;
    }

    /* ─── Ring overrides ─── */
    body [class*="ring-indigo-"],
    body [class*="ring-purple-"] {
      --tw-ring-color: ${themeColor}40 !important;
    }

    /* ─── Focus state overrides ─── */
    body [class*="focus:border-indigo"]:focus,
    body [class*="focus:ring-indigo"]:focus {
      border-color: ${themeColor} !important;
      --tw-ring-color: ${themeColor}30 !important;
    }

    /* ─── Hover state overrides ─── */
    body [class*="hover:bg-indigo"]:hover,
    body [class*="hover:bg-purple"]:hover {
      background-color: ${hover} !important;
    }
    body [class*="hover:text-indigo"]:hover,
    body [class*="hover:text-purple"]:hover {
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
