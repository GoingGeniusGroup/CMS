import Link from "next/link";
import { Compass, Home } from "lucide-react";

/**
 * Beautiful fallback shown on public routes whose module has been disabled
 * by an admin in Settings > Sidebar Modules. Used instead of a bare 404 so
 * visitors get a clear, on-brand explanation.
 */
export function ModuleDisabledPage({ moduleLabel }: { moduleLabel?: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-white to-zinc-50 px-4 py-20">
      <div className="w-full max-w-md rounded-3xl border border-zinc-100 bg-white p-10 text-center shadow-xl shadow-indigo-100/50">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
          <Compass className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-indigo-600">
          Section Unavailable
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-zinc-900">
          This section is temporarily unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          {moduleLabel
            ? `The ${moduleLabel} section has been disabled by the site administrator. `
            : "This section has been disabled by the site administrator. "}
          Please check back later.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
