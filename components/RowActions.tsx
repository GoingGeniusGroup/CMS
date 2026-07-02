"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

/**
 * Consistent View / Edit / Delete actions.
 *
 * - `variant="icons"` (default): compact icon row, used in desktop tables.
 * - `variant="buttons"`: full-width labelled buttons, used in mobile cards.
 */
export function RowActions({
  variant = "icons",
  onView,
  onEdit,
  onDelete,
}: {
  variant?: "icons" | "buttons";
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  if (variant === "buttons") {
    return (
      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onView}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
        title="View"
      >
        <Eye className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
        title="Edit"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
