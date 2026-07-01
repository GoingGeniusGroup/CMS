"use client";

import { Download, Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

/* min-h/w of 44px on each button meets the WCAG 2.5.5 touch-target recommendation */
export function ActionButtons({ onView, onEdit, onDownload, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        title="View invoice"
        onClick={onView}
        aria-label="View invoice"
        className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <button
        type="button"
        title="Edit invoice"
        onClick={onEdit}
        aria-label="Edit invoice"
        className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <button
        type="button"
        title="Download PDF"
        onClick={onDownload}
        aria-label="Download invoice PDF"
        className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <button
        type="button"
        title="Delete invoice"
        onClick={onDelete}
        aria-label="Delete invoice"
        className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
}
