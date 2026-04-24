"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaUpload,
  FaNewspaper,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

type NewsArticle = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  sourceUrl?: string;
  sourceLabel?: string;
  publishedAt: string;
};

// ─── Reusable Field (mirrors the one in main admin) ───────────────────────────

function Field({
  label, placeholder, value, onChange, optional = false, type = "text",
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; optional?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
        {label}
        {optional && (
          <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">(optional)</span>
        )}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition"
      />
    </div>
  );
}

// ─── Image upload block (single image) ───────────────────────────────────────

function CoverImageUpload({
  preview, newFile, onChange, onRemove, isEditing,
}: {
  preview: string; newFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void; isEditing: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
        Cover Image
        {isEditing && (
          <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">(upload new to replace)</span>
        )}
      </label>
      <label
        htmlFor="newsImageUpload"
        className="flex items-center justify-center gap-3 border-2 border-dashed border-white/10 hover:border-amber-400/40 hover:bg-amber-400/5 rounded-2xl py-7 cursor-pointer transition-all"
      >
        <FaUpload className="text-gray-500" />
        <span className="text-sm text-gray-400">
          {preview ? (newFile ? "1 file selected — click to change" : "Existing image — click to replace") : "Click to upload cover image"}
        </span>
        <input id="newsImageUpload" type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
      {preview && (
        <div className="mt-4 relative inline-block group">
          <img src={preview} alt="Cover preview" className="w-32 h-24 object-cover rounded-xl border border-white/10" />
          {newFile && (
            <button
              onClick={onRemove}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >✕</button>
          )}
          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">Cover</div>
        </div>
      )}
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({
  onConfirm, onCancel,
}: {
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 text-xl mb-5">
          <FaTrash />
        </div>
        <h3 className="text-lg font-extrabold text-white mb-2">Delete Article?</h3>
        <p className="text-gray-500 text-sm mb-7">
          This cannot be undone. The article will be permanently removed from the site.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition text-sm"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Image compression (mirrors the one in main admin) ────────────────────────

async function compressImage(file: File, maxWidthPx = 1920, maxSizeMB = 4): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width);
        width = maxWidthPx;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(file);
          if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.3) {
            quality -= 0.1;
            tryCompress();
          } else {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          }
        }, "image/jpeg", quality);
      };
      tryCompress();
    };
    img.src = url;
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = ["Market Update", "New Launch", "Policy & Rera", "Investment Tips", "Home Buying Guide"];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function NewsAdmin({
  showToast,
}: {
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  // ── View state ──────────────────────────────────────────────────────────────
  const [newsView, setNewsView] = useState<"list" | "form">("list");

  // ── Data ────────────────────────────────────────────────────────────────────
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // ── Form fields ─────────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Market Update");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data);
    } catch {
      showToast("Failed to load articles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setSummary(""); setContent("");
    setCategory("Market Update"); setSourceUrl(""); setSourceLabel("");
    setImageFile(null); setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (a: NewsArticle) => {
    setEditingId(a.id);
    setTitle(a.title); setSummary(a.summary); setContent(a.content);
    setCategory(a.category); setSourceUrl(a.sourceUrl || ""); setSourceLabel(a.sourceLabel || "");
    setImagePreview(a.image); setImageFile(null);
    setNewsView("form");
  };

  // ── Upload ──────────────────────────────────────────────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    setCompressing(true);
    const compressed = await compressImage(file);
    setCompressing(false);
    const formData = new FormData();
    formData.append("images", compressed);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.images[0];
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      showToast("Title, summary, and content are required", "error");
      return;
    }
    if (!editingId && !imageFile) {
      showToast("A cover image is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const body: any = {
        title, summary, content, image: imageUrl, category,
        ...(sourceUrl.trim() && { sourceUrl }),
        ...(sourceLabel.trim() && { sourceLabel }),
      };

      const res = await fetch("/api/news", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...body } : body),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Article updated!" : "Article published!");
      resetForm();
      setNewsView("list");
      fetchArticles();
    } catch {
      showToast("Failed to save article", "error");
    } finally {
      setSubmitting(false);
      setCompressing(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      showToast("Article deleted");
      setDeleteConfirmId(null);
      fetchArticles();
    } catch {
      showToast("Failed to delete article", "error");
    }
  };

  const submitLabel = compressing
    ? "Compressing image…"
    : submitting
    ? editingId ? "Updating…" : "Publishing…"
    : editingId ? "Update Article" : "Publish Article";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <motion.div
      key="news"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >

      {/* ── Delete modal ── */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <DeleteModal
            onConfirm={() => handleDelete(deleteConfirmId)}
            onCancel={() => setDeleteConfirmId(null)}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════ LIST VIEW */}
      {newsView === "list" && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">News Articles</h2>
              <p className="text-gray-500 text-sm mt-1">
                {articles.length} article{articles.length !== 1 ? "s" : ""} published
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setNewsView("form"); }}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
              <FaPlus size={11} /> New Article
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 text-sm py-10">
              <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
              Loading articles…
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-24 text-gray-600">
              <FaNewspaper className="text-5xl mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No articles yet.</p>
              <p className="text-xs mt-1 text-gray-700">Click "New Article" to publish your first one.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-36">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {article.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed flex-1">
                      {article.summary}
                    </p>
                    <p className="text-gray-600 text-[10px] mt-2">
                      {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      <a
                        href={`/news/${article.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition text-xs"
                      >
                        <FaEye />
                      </a>
                      <button
                        onClick={() => handleEdit(article)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-amber-400/20 text-gray-400 hover:text-amber-400 rounded-lg transition text-xs"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(article.id)}
                        title="Delete"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition text-xs ml-auto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════ FORM VIEW */}
      {newsView === "form" && (
        <div className="max-w-3xl">
          {/* Form header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold">
                {editingId ? "Edit Article" : "New Article"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {editingId ? "Update the article details below." : "Fill in the details to publish a new article."}
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setNewsView("list"); }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition"
            >
              <FaTimes size={12} /> Cancel
            </button>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-8">

            {/* Category picker */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      category === cat
                        ? "bg-amber-400 text-gray-900 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Core fields */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Content
              </p>
              <div className="space-y-4">
                <Field
                  label="Title"
                  placeholder="e.g. Mumbai Property Prices Rise 12% in Q1 2026"
                  value={title}
                  onChange={setTitle}
                />
                <Field
                  label="Summary"
                  placeholder="A short 1–2 sentence summary shown on the news card"
                  value={summary}
                  onChange={setSummary}
                />
                {/* Full content textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                    Full Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write the full article content here. Use line breaks to separate paragraphs."
                    rows={10}
                    className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition resize-none leading-relaxed"
                  />
                  <p className="text-gray-600 text-xs mt-1.5 text-right">{content.length} characters</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Cover image */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Media
              </p>
              <CoverImageUpload
                preview={imagePreview}
                newFile={imageFile}
                onChange={handleImageChange}
                onRemove={() => { setImageFile(null); setImagePreview(""); }}
                isEditing={!!editingId}
              />
            </div>

            <div className="h-px bg-white/5" />

            {/* Optional source */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Source
                <span className="text-gray-600 normal-case tracking-normal font-normal text-xs">(optional)</span>
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Source URL"
                  placeholder="https://economictimes.com/..."
                  value={sourceUrl}
                  onChange={setSourceUrl}
                  optional
                />
                <Field
                  label="Button Label"
                  placeholder='e.g. "Read on ET Realty"'
                  value={sourceLabel}
                  onChange={setSourceLabel}
                  optional
                />
              </div>
              <p className="text-gray-600 text-xs mt-2">
                If provided, a "Read Full Article" button will appear at the bottom of the detail page.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || compressing}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] text-sm"
            >
              {(submitting || compressing) && (
                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              )}
              {!submitting && !compressing && <FaCheck size={13} />}
              {submitLabel}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}