"use client";

import { useRef, useState } from "react";
import { Lock, UploadCloud } from "lucide-react";

function UploadBox({
  recommended,
  accept = "image/*",
}: {
  recommended: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="flex h-28 w-full max-w-[220px] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-zinc-100 text-zinc-400 transition-colors hover:bg-zinc-200"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={fileName ?? "preview"}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <>
            <UploadCloud className="h-6 w-6" />
            <span className="text-xs">Click to upload</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {preview ? (
        <button
          type="button"
          onClick={handleRemove}
          className="w-fit text-xs font-medium text-rose-500"
        >
          Remove
        </button>
      ) : (
        <span className="w-fit text-xs font-medium text-rose-500/60">Remove</span>
      )}
      <span className="text-xs text-zinc-500">{recommended}</span>
    </div>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        on ? "bg-emerald-500" : "bg-zinc-300"
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function GeneralSettingsPage() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-bold text-amber-500">General Settings</h1>
      </div>
      <p className="mt-2 text-sm text-black">
        Manage the websites basic information and appearance
      </p>

      {/* Logo + Favicon */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Site Logo
          </label>
          <UploadBox recommended="Recommended size: 175*40px" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Favicon
          </label>
          <UploadBox
            recommended="Recommended size: 32*32px"
            accept="image/png,image/x-icon,image/svg+xml"
          />
        </div>
      </div>

      {/* Title + Theme color */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            App/Site Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Default Theme Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              defaultValue="#f81b6f"
              className="h-11 w-24 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 shadow-sm"
            />
            <input
              type="text"
              defaultValue="#F1B6"
              className="h-11 w-28 rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-black">
          Description
        </label>
        <div className="relative">
          <textarea
            rows={4}
            maxLength={160}
            className="w-full resize-none rounded-lg border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-zinc-400">
            120/160
          </span>
        </div>
      </div>
      

      {/* Meta keywords */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-black">
          Meta Keywords
        </label>
        <input
          type="text"
          className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Base color toggle */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-black">Website Base Color</span>
        <Toggle />
        <span className="text-sm font-semibold text-black">Enable</span>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-violet-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
