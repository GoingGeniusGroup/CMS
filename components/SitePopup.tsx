"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TiptapRenderer } from "@/components/TiptapRenderer";
import type { JSONContent } from "@tiptap/react";

type Slide = { imageUrl: string; linkUrl?: string };

type SitePopupProps = {
  showPopup: boolean;
  content: Record<string, unknown>;
};

function hashContent(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export function SitePopup({ showPopup, content }: SitePopupProps) {
  const [visible, setVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides: Slide[] = Array.isArray((content as { slides?: Slide[] })?.slides) ? (content as { slides: Slide[] }).slides : [];
  const editorContent = (content as { editorContent?: Record<string, unknown> })?.editorContent ?? null;

  const contentStr = JSON.stringify(content);
  const dismissKey = `popup-dismissed:${hashContent(contentStr)}`;

  const hasEditorContent = editorContent && Object.keys(editorContent).length > 0;
  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (!showPopup || (!hasEditorContent && !hasSlides)) return;
    const dismissed = localStorage.getItem(dismissKey);
    if (!dismissed) {
      setVisible(true);
    }
  }, [showPopup, hasEditorContent, hasSlides, dismissKey]);

  function handleClose() {
    localStorage.setItem(dismissKey, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Editor Content */}
        {hasEditorContent && (
          <div className="prose prose-sm max-w-none text-gray-700 mb-4">
            <TiptapRenderer content={editorContent as JSONContent} />
          </div>
        )}

        {/* Slides */}
        {hasSlides && (
          <div>
            {(() => {
              const s = slides[slideIndex];
              const img = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imageUrl}
                  alt={`Popup ${slideIndex + 1}`}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
                />
              );
              return (
                <div>
                  <div className="flex items-center justify-center">
                    {s.linkUrl ? (
                      <a href={s.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </div>
                  {slides.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlideIndex(i)}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            i === slideIndex ? "bg-indigo-600" : "bg-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        <button
          onClick={handleClose}
          className="mt-4 w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
