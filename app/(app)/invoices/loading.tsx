// Route-level Suspense fallback for /invoices — the page is a server component
// whose data queries block the route, so this renders instantly on navigation.
export default function InvoicesLoading() {
  return (
    <div className="space-y-5 sm:space-y-6 animate-pulse">
      <div className="h-10 w-full rounded-2xl bg-zinc-100" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-zinc-200" />
          <div className="h-4 w-56 rounded bg-zinc-100" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-zinc-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-100" />
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-4">
        <div className="h-6 w-40 rounded bg-zinc-200" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-lg bg-zinc-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
