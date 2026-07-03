"use client";

import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  required?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  required = false,
}: ImageUploaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {value && (
        <div className="flex items-center gap-3 mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}

      <FileUploaderRegular
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
        maxLocalFileSizeBytes={5_000_000}
        imgOnly
        onFileUploadSuccess={(file) => {
          onChange(file.cdnUrl ?? null);
        }}
        onFileRemoved={() => {
          onChange(null);
        }}
        className="w-full"
      />
      {value && (
        <p className="text-xs text-emerald-600">✓ Image uploaded</p>
      )}
    </div>
  );
}
