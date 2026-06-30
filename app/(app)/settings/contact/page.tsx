import { Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function ContactSettingsPage() {
  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Phone className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-amber-500">
              Contact Settings
            </h1>
          </div>
          <p className="mt-2 text-sm text-black">
            Manage your contact information that will be displayed on websites.
          </p>
        </div>
        <Button className="shrink-0">Save Changes</Button>
      </div>

      {/* Phone numbers */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Phone No 1 <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Phone No 2
          </label>
          <input
            type="tel"
            className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Email addresses */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Email Address 1 <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Email Address 2
          </label>
          <input
            type="email"
            className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-black">
          Address
        </label>
        <input
          type="text"
          className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Contact Mail */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-black">
          Contact Mail <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Office Hours */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-black">
          Office Hours Open-Close Times
        </label>
        <input
          type="text"
          placeholder="Monday to Friday 9:00am - 6:00pm"
          className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Google Map */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Google Map Embed Code
          </label>
          <textarea
            className="h-56 w-full resize-none rounded-xl border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Google Map Preview
          </label>
          <div className="h-56 w-full rounded-xl border border-zinc-200 bg-zinc-100" />
        </div>
      </div>
    </Card>
  );
}
