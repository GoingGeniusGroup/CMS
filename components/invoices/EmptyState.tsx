import { FileX } from "lucide-react";

export function EmptyState({ query }: { query: string }) {
  return (
    <tr>
      <td colSpan={8} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <FileX className="h-12 w-12 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">
            {query ? `No invoices found for "${query}"` : "No invoices yet."}
          </p>
        </div>
      </td>
    </tr>
  );
}
