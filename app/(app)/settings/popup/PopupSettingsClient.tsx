"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { ShieldCheck, Plus, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { TiptapEditor } from "@/components/TiptapEditor";
import { savePopupSettings } from "@/app/actions/popup";
import type { JSONContent } from "@tiptap/react";

type Slide = { imageUrl: string; linkUrl: string };

export default function PopupSettingsClient({ initialData }: { initialData: { showPopup: boolean; content: Record<string, unknown> } }) {
  const contentData = initialData.content as { slides?: Slide[]; editorContent?: Record<string, unknown> };
  const initialSlides: Slide[] = Array.isArray(contentData?.slides) ? contentData.slides : [];
  const initialEditorContent = (contentData?.editorContent ?? null) as JSONContent | null;

  const [showPopup, setShowPopup] = useState(initialData.showPopup);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [editorContent, setEditorContent] = useState<JSONContent | null>(initialEditorContent);
  const slidesRef = useRef(slides);
  useEffect(() => { slidesRef.current = slides; }, [slides]);
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const hasChanges =
    showPopup !== initialData.showPopup ||
    JSON.stringify(slides) !== JSON.stringify(initialSlides) ||
    JSON.stringify(editorContent) !== JSON.stringify(initialEditorContent);

  function handleCancel() {
    setShowPopup(initialData.showPopup);
    setSlides(initialSlides);
    setEditorContent(initialEditorContent);
    setToast(null);
  }

  function addSlide() {
    setSlides((prev) => [...prev, { imageUrl: "", linkUrl: "" }]);
  }

  function updateSlide(i: number, field: keyof Slide, value: string) {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function removeSlide(i: number) {
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await savePopupSettings({
        showPopup,
        content: { slides, editorContent },
      });
      setToast(
        result.success
          ? { message: "Settings saved successfully.", ok: true }
          : { message: result.error ?? "Failed to save.", ok: false }
      );
    });
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Website Popup Settings</h1>
              <p className="text-xs text-zinc-500">Manage Website popup display settings and content.</p>
            </div>
          </div>
          {hasChanges && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} disabled={isPending}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isPending}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-6 rounded-lg px-4 py-2.5 text-sm font-medium ${
            toast.ok
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

    <Card className="p-6 sm:p-8">
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

        {/* Popup Editor Content */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Popup Content</label>
          <p className="mb-3 text-xs text-zinc-500">
            Use the editor below to add text, formatting, and embedded images.
          </p>
          <TiptapEditor
            content={editorContent as JSONContent | null}
            onChange={(json) => setEditorContent(json)}
            placeholder="Write popup content..."
          />
        </div>

        <hr className="border-zinc-200" />

        {/* Popup Slides */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-bold text-zinc-800">Popup Images with Links</label>
            <button type="button" onClick={addSlide}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
              <Plus className="h-4 w-4" /> Add Image
            </button>
          </div>
          <p className="mb-4 text-xs text-zinc-500">
            Upload images for the popup. Each image can have an optional link — when a visitor clicks the image, they will be redirected to that URL.
          </p>

          {slides.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
              <p className="text-sm text-zinc-500">No images added yet. Click "Add Image" to start.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {slides.map((slide, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <ImageUploader
                        label={`Image ${i + 1}`}
                        value={slide.imageUrl || null}
                        onChange={(url) => updateSlide(i, "imageUrl", url ?? "")}
                      />
                      <div>
                        <label className="mb-1 block text-sm font-bold text-zinc-800">Link URL (optional)</label>
                        <input
                          type="url"
                          value={slide.linkUrl}
                          onChange={(e) => updateSlide(i, "linkUrl", e.target.value)}
                          placeholder="https://example.com"
                          className={inputCls}
                        />
                        <p className="mt-1 text-xs text-zinc-400">When a visitor clicks this image, they will be redirected here.</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeSlide(i)}
                      className="mt-1 rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove image">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
    </>
  );
}
