"use client";

import { Download, Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export function ActionButtons({ onView, onEdit, onDownload, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        title="View"
        onClick={onView}
        className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        aria-label="View invoice"
      >
        <Eye className="h-5 w-5" />
      </button>
      <button
        type="button"
        title="Edit"
        onClick={onEdit}
        className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        aria-label="Edit invoice"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <button
        type="button"
        title="Download PDF"
        onClick={onDownload}
        className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        aria-label="Download invoice PDF"
      >
        <Download className="h-5 w-5" />
      </button>
      <button
        type="button"
        title="Delete"
        onClick={onDelete}
        className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label="Delete invoice"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
