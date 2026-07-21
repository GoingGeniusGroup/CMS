"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/Card";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/app/actions/faq";
import type { FaqData } from "@/app/actions/faq";

const CATEGORY_OPTIONS = ["General", "Services", "Pricing", "Support"];

export function FaqClient({ initialFaqs }: { initialFaqs: FaqData[] }) {
  const [faqs, setFaqs] = useState<FaqData[]>(initialFaqs);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New FAQ form
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  function resetNewForm() {
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory("General");
  }

  async function handleAdd() {
    if (!newQuestion.trim()) return;
    setIsSubmitting(true);
    setMessage(null);
    const result = await createFaq({ question: newQuestion, answer: newAnswer, category: newCategory });
    setIsSubmitting(false);
    if (result.success) {
      setMessage({ type: "success", text: "FAQ added!" });
      resetNewForm();
      const updated = await getFaqs();
      setFaqs(updated);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to add FAQ" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true);
    setMessage(null);
    const result = await deleteFaq(id);
    setIsSubmitting(false);
    if (result.success) {
      setMessage({ type: "success", text: "FAQ deleted!" });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete FAQ" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <div className="flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 -mx-6 -mt-5 mb-6 border-b border-zinc-200 bg-white px-6 py-4 sm:-mx-8 sm:-mt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">FAQ</h1>
            <p className="text-sm text-zinc-500">Manage frequently asked questions displayed on the website.</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Add New FAQ */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Add New FAQ</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-800">Question</label>
            <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="e.g. What services do you offer?" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-800">Answer</label>
            <textarea rows={3} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Write the answer here..." className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-800">Category</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={inputCls}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="button" onClick={handleAdd} disabled={isSubmitting || !newQuestion.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        </div>
      </Card>

      {/* FAQ List */}
      <Card noPadding className="mt-6 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-black">All FAQs ({faqs.length})</h3>
        </div>

        {faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <HelpCircle className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No FAQs yet. Add one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {faqs.map((faq) => (
              <div key={faq.id}>
                <div
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="flex w-full cursor-pointer items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{faq.question}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {faq.category && <span className="rounded bg-zinc-100 px-2 py-0.5 mr-2">{faq.category}</span>}
                      {faq.answer ? `${faq.answer.substring(0, 60)}...` : "No answer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }}
                      disabled={isSubmitting}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedId === faq.id ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                  </div>
                </div>

                {expandedId === faq.id && (
                  <EditableFaq faq={faq} onUpdated={(updated) => setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))} />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function EditableFaq({ faq, onUpdated }: { faq: FaqData; onUpdated: (faq: FaqData) => void }) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [category, setCategory] = useState(faq.category || "General");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || "General");
  }, [faq.id, faq.question, faq.answer, faq.category]);

  async function handleSave() {
    if (!question.trim()) return;
    setIsSaving(true);
    setSaved(false);
    const result = await updateFaq(faq.id, { question, answer, category });
    setIsSaving(false);
    if (result.success) {
      onUpdated({ ...faq, question, answer, category });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4">
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-zinc-700">Question</label>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-zinc-700">Answer</label>
          <textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-indigo-400" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48">
            <label className="mb-1 block text-xs font-bold text-zinc-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mt-5 flex items-center gap-3">
            {saved && <span className="text-xs font-medium text-green-600">Saved!</span>}
            <button type="button" onClick={handleSave} disabled={isSaving || !question.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
