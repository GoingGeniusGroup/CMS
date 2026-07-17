"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TopBannerProps {
  imageUrl: string;
  link?: string | null;
}

export function TopBanner({ imageUrl, link }: TopBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const content = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="Promotion" className="h-full w-full object-cover" />
  );

  return (
    <div className="relative w-full bg-zinc-900" id="top-banner">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-center sm:h-14">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
