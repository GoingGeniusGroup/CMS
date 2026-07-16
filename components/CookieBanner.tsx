"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

type CookieBannerProps = {
  showCookiesAgreement: boolean;
  cookiesAgreementText: string;
};

// Simple stable hash so a changed cookie text gets a fresh consent key.
function hashContent(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32-bit int
  }
  return String(hash);
}

export function CookieBanner({ showCookiesAgreement, cookiesAgreementText }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  const consentKey = `cookies-accepted:${hashContent(cookiesAgreementText || "")}`;

  useEffect(() => {
    // Only show if settings say to show AND user hasn't already responded to THIS text
    if (!showCookiesAgreement) return;
    const responded = localStorage.getItem(consentKey);
    if (!responded) {
      setVisible(true);
    }
  }, [showCookiesAgreement, consentKey]);

  function handleAccept() {
    localStorage.setItem(consentKey, "true");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(consentKey, "false");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900">Cookie Consent</h3>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {cookiesAgreementText || "We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAccept}
                className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400"
              >
                Decline
              </button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
