"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

type Platform = "whatsapp" | "messenger" | "custom";

type FloatingChatWidgetProps = {
  enabled: boolean;
  platform: Platform;
  value: string; // phone number, username, or full URL
  label?: string;
};

function buildChatUrl(platform: Platform, value: string): string {
  if (!value) return "#";
  switch (platform) {
    case "whatsapp": {
      // Strip non-digits for the WhatsApp API link
      const digits = value.replace(/[^\d]/g, "");
      return `https://wa.me/${digits}`;
    }
    case "messenger": {
      // value is the Facebook page username or ID
      const clean = value.replace(/^https?:\/\/(www\.)?m\.me\//, "").replace(/^https?:\/\/(www\.)?messenger\.com\/t\//, "");
      return `https://m.me/${clean}`;
    }
    case "custom":
      // value is the full URL
      return value.startsWith("http") ? value : `https://${value}`;
  }
}

const PLATFORM_COLORS: Record<Platform, { bg: string; hover: string }> = {
  whatsapp: { bg: "bg-[#25D366]", hover: "hover:bg-[#1ebe57]" },
  messenger: { bg: "bg-[#0084FF]", hover: "hover:bg-[#0073e6]" },
  custom: { bg: "bg-indigo-600", hover: "hover:bg-indigo-700" },
};

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (platform === "messenger") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.26 5.886-3.26-6.558 6.763z" />
      </svg>
    );
  }
  return <MessageCircle className="h-7 w-7" />;
}

export function FloatingChatWidget({ enabled, platform, value, label }: FloatingChatWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!enabled || !value) return null;

  const url = buildChatUrl(platform, value);
  const colors = PLATFORM_COLORS[platform];
  const tooltipText = label || "Chat with us";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          {tooltipText}
        </div>
      )}

      {/* FAB */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all ${colors.bg} ${colors.hover} hover:scale-110 active:scale-95`}
        aria-label={tooltipText}
      >
        <PlatformIcon platform={platform} />
      </a>
    </div>
  );
}
