"use client";

import { useRef } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import type { UploadCtxProvider } from "@uploadcare/file-uploader";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  required?: boolean;
  multiple?: boolean;
  /** Small square preview instead of the full-width landscape one (logos/favicons). */
  compact?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  required = false,
  multiple = false,
  compact = false,
}: ImageUploaderProps) {
  const uploaderRef = useRef<UploadCtxProvider | null>(null);

  const handleTriggerUpload = () => {
    if (uploaderRef.current) {
      uploaderRef.current.getAPI()?.initFlow();
    }
  };

  const handleDelete = () => {
    onChange(null);
    try {
      uploaderRef.current?.getAPI()?.removeAllFiles();
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {value && (
        <div className="p-3 flex flex-wrap items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/50">
          {compact ? (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="h-12 w-12 object-contain" />
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200 bg-zinc-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="h-full w-full object-cover object-center" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Change Photo
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className={value ? "absolute opacity-0" : "block"}>
        <FileUploaderRegular
          apiRef={uploaderRef}
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
          maxLocalFileSizeBytes={5_000_000}
          imgOnly
          multiple={multiple}
          onFileUploadSuccess={(file) => {
            if (file.cdnUrl) {
              onChange(file.cdnUrl);
            }
          }}
          onFileUploadFailed={(file) => {
            console.error("Uploadcare file upload failed:", file);
          }}
          onCommonUploadFailed={(event) => {
            console.error("Uploadcare common upload failed:", event);
          }}
          className="w-full"
        />
      </div>

      {value && (
        <p className="text-xs text-emerald-600 font-medium">✓ Image uploaded</p>
      )}
    </div>
  );
}
