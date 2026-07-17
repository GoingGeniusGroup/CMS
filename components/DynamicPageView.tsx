"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { TiptapRenderer } from "@/components/TiptapRenderer";

type Section = {
  id: string;
  title: string;
  body: JSONContent;
};

function slugify(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return base ? `${base}-${index}` : `section-${index}`;
}

function extractText(node: JSONContent): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (Array.isArray(node.content)) return node.content.map(extractText).join("");
  return "";
}

/**
 * Splits a Tiptap doc into an intro block (everything before the first H2)
 * and a list of numbered sections, one per H2 heading.
 */
function splitSections(content: JSONContent | null): {
  intro: JSONContent | null;
  sections: Section[];
} {
  const nodes = content?.content ?? [];
  const introNodes: JSONContent[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;
  let started = false;

  nodes.forEach((node) => {
    const isH2 = node.type === "heading" && node.attrs?.level === 2;
    if (isH2) {
      started = true;
      const title = extractText(node) || "Section";
      current = {
        id: slugify(title, sections.length + 1),
        title,
        body: { type: "doc", content: [] },
      };
      sections.push(current);
      return;
    }
    if (!started) {
      introNodes.push(node);
    } else if (current) {
      (current.body.content as JSONContent[]).push(node);
    }
  });

  return {
    intro: introNodes.length ? { type: "doc", content: introNodes } : null,
    sections,
  };
}

export function DynamicPageView({
  title,
  content,
  updatedAt,
}: {
  title: string;
  content: JSONContent | null;
  updatedAt?: string;
}) {
  const { intro, sections } = splitSections(content);
  const hasSections = sections.length > 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* ── Sidebar TOC ─────────────────────────────── */}
          {hasSections && (
            <aside className="lg:sticky lg:top-24 lg:w-64 lg:shrink-0">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  On this page
                </p>
                <nav className="space-y-1">
                  {sections.map((s, i) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-[var(--theme-color,#fe9a00)]"
                    >
                      <span className="font-medium text-zinc-400">{i + 1}.</span>{" "}
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* ── Main content ────────────────────────────── */}
          <main className="min-w-0 flex-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--theme-color,#fe9a00)]">
                Legal &amp; Compliance
              </p>
              <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
                {title}
              </h1>
              {updatedAt && (
                <p className="mt-3 text-sm text-zinc-400">
                  Last updated: {updatedAt}
                </p>
              )}

              {/* Intro */}
              {intro && (
                <div className="mt-6 text-zinc-600">
                  <TiptapRenderer content={intro} />
                </div>
              )}

              {/* Numbered sections */}
              {hasSections ? (
                <div className="mt-8 space-y-10">
                  {sections.map((s, i) => (
                    <section key={s.id} id={s.id} className="scroll-mt-28">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--theme-color,#fe9a00)] text-sm font-bold text-white">
                          {i + 1}
                        </span>
                        <h2 className="text-xl font-bold text-zinc-900">
                          {s.title}
                        </h2>
                      </div>
                      <div className="pl-11 text-zinc-600">
                        <TiptapRenderer content={s.body} />
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                !intro && (
                  <p className="mt-6 text-zinc-500">No content available yet.</p>
                )
              )}
            </div>

            {/* ── CTA bar ──────────────────────────────── */}
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-zinc-900 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-lg font-bold text-white">
                  Have questions about {title.toLowerCase()}?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  We&apos;re here to help you understand everything.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-color,#fe9a00)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
