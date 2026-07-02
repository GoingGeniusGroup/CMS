
"use client";
import {ChevronDown} from "lucide-react"

import { useState } from "react";

interface AddBlogModalProps {
  onClose: () => void;
}

export default function AddBlogModal({ onClose }: AddBlogModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("");
  const [internalUse, setInternalUse] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statusOptions = ["published", "draft", "pending"];

  return (
   <>
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-md p-6 w-[420px]">

      {/* Heading */}
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Add Blog
      </h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Title <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Enter Services title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Content <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={4}
          placeholder="Enter short details"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Slug
        </label>

        <textarea
          rows={4}
          placeholder="Write description here..."
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
    

      {/* Status */}
      <div className="mb-5 relative">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Status
        </label>

        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex justify-between items-center px-4 py-2.5 border border-gray-300 rounded-xl"
        >
          <span className={status ? "capitalize" : "text-gray-400"}>
            {status || "Select Status"}
          </span>

          <ChevronDown size={18} />
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg">
            {statusOptions.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setStatus(option);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer capitalize"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

     {/* Toggle */}
<div className="mb-6">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-gray-800">
      Internal use only
    </span>

    <button
      type="button"
      onClick={() => setInternalUse(!internalUse)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        internalUse ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 -translate-y-1/2 ${
          internalUse ? "right-1" : "left-1"
        }`}
      />
    </button>
  </div>
  
</div>
        <p className="text-xs text-gray-400 mt-1">
          Enable this if this blog is for internal use only.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">

        <button
          onClick={onClose}
          className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log({
              title,
              content,
              slug,
              status,
              internalUse,
            });

            onClose();
          }}
          className="px-5 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Add Blog
        </button>

      </div>

    </div>
  </div>


   </>
  );
}