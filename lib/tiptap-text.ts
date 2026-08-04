import type { JSONContent } from "@tiptap/react";

/**
 * Service (and similar) rich-text fields are stored as a `JSON.stringify`'d
 * Tiptap document (see AddServiceModal/EditServiceModal). Public cards and
 * modals were rendering that raw JSON string as text. These helpers convert
 * the stored value back into something displayable.
 *
 * Both tolerate a plain (non-JSON) string too, so older records that stored a
 * plain description — or any field that was never rich text — pass through
 * unchanged rather than breaking.
 */

/** Parse a stored value into a Tiptap document, or null if it isn't one. */
export function parseTiptapContent(value: string | null | undefined): JSONContent | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    // A Tiptap doc is an object with a `type` (usually "doc") and/or `content`.
    if (parsed && typeof parsed === "object" && ("type" in parsed || "content" in parsed)) {
      return parsed as JSONContent;
    }
    return null;
  } catch {
    return null;
  }
}

/** Recursively collect the text out of a Tiptap node tree. */
function collectText(node: JSONContent, out: string[]) {
  if (typeof node.text === "string") out.push(node.text);
  if (Array.isArray(node.content)) {
    for (const child of node.content) collectText(child, out);
    // Block-level nodes get a separating space so words don't run together
    // across paragraphs/list items when flattened to a single string.
    if (node.type && node.type !== "text") out.push(" ");
  }
}

/**
 * Returns a plain-text version of a stored rich-text field. If the value is
 * Tiptap JSON, its text is extracted; if it's already a plain string (or empty),
 * it's returned as-is (trimmed).
 */
export function tiptapToPlainText(value: string | null | undefined): string {
  if (!value) return "";
  const doc = parseTiptapContent(value);
  if (!doc) return value.trim();
  const out: string[] = [];
  collectText(doc, out);
  return out.join("").replace(/\s+/g, " ").trim();
}
