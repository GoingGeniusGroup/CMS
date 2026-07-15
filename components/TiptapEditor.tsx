"use client";

import { useState } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Maximize2, Minimize2 } from "lucide-react";
import { EditorToolbar } from "./EditorToolbar";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content?: JSONContent | null;
  onChange?: (json: JSONContent) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing your blog post...",
}: TiptapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        // Disable extensions we configure separately
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content || undefined,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="h-[300px] w-full animate-pulse rounded-xl border border-zinc-200 bg-zinc-50" />
    );
  }

  const editorUI = (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[100] flex flex-col bg-white"
          : "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
      }
    >
      {/* Toolbar + fullscreen toggle */}
      <div className="flex items-center border-b border-zinc-200 bg-zinc-50/80">
        <div className="flex-1 overflow-x-auto">
          <EditorToolbar editor={editor} />
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen editor"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Content area */}
      <div
        className={
          isFullscreen
            ? "flex-1 overflow-y-auto mx-auto w-full max-w-4xl"
            : "max-h-[500px] overflow-y-auto"
        }
      >
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2">
        {isFullscreen && (
          <span className="text-xs text-zinc-400">
            Press <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium">Esc</kbd> or click minimize to exit
          </span>
        )}
        <span className="ml-auto text-xs text-zinc-400">
          {editor.storage.characterCount.characters()} characters
          {" · "}
          {editor.storage.characterCount.words()} words
        </span>
      </div>
    </div>
  );

  return editorUI;
}
