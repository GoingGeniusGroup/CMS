"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type SitePopupProps = {
  showPopup: boolean;
  content: string;
};

export function SitePopup({ showPopup, content }: SitePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!showPopup || !content) return;
    const dismissed = sessionStorage.getItem("popup-dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, [showPopup, content]);

  function handleClose() {
    sessionStorage.setItem("popup-dismissed", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Popup */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-8">
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {content}
          </div>
        </div>

        <button
          onClick={handleClose}
          className="mt-5 w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
