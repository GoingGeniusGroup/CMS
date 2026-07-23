// Route-level Suspense fallback for /dashboard — shows instantly on navigation
// while the page (and its data fetch) loads. Lightweight skeleton only.
export default function DashboardLoading() {
  return (
    <div className="space-y-5 sm:space-y-6 animate-pulse">
      <div className="h-10 w-full rounded-2xl bg-zinc-100" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-zinc-200" />
          <div className="h-4 w-56 rounded bg-zinc-100" />
        </div>
        <div className="h-14 w-52 rounded-2xl bg-zinc-100" />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-100" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-zinc-100" />
        <div className="h-80 rounded-2xl bg-zinc-100" />
      </section>
    </div>
  );
}
