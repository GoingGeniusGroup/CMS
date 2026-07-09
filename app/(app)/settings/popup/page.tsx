"use client";

import { useEffect, useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { getPopupSettings, savePopupSettings } from "@/app/actions/popup";

export default function PopupSettingsPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [content, setContent] = useState("");
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load saved settings on mount
  useEffect(() => {
    getPopupSettings().then((data) => {
      setShowPopup(data.showPopup);
      setContent(data.content);
    });
  }, []);

  // Auto-dismiss toast after 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleSave() {
    if (!content.trim()) {
      setToast({ message: "Popup content cannot be empty. Please write something before saving.", ok: false });
      return;
    }
    startTransition(async () => {
      const result = await savePopupSettings({ showPopup, content });
      setToast(
        result.success
          ? { message: "Settings saved successfully.", ok: true }
          : { message: result.error ?? "Failed to save.", ok: false }
      );
    });
  }

  return (
    <Card className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
            <ShieldCheck className="h-5 w-5 text-zinc-900" />
            Website Popup Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage Website popup display settings and content.
          </p>
        </div>
        <Button
          className="w-full shrink-0 sm:w-auto"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 rounded-lg px-4 py-2.5 text-sm font-medium ${
            toast.ok
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-6">
        {/* Show website popup toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-800">Show website popup?</span>
          <button
            type="button"
            role="switch"
            aria-checked={showPopup}
            onClick={() => setShowPopup((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              showPopup ? "bg-green-500" : "bg-zinc-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                showPopup ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Popup Content */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">
            Popup Content
          </label>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      </div>
    </Card>
  );
}
