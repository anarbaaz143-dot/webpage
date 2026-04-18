"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaInstagram,
} from "react-icons/fa";

type BlogPost = {
  id: number;
  title: string;
  summary: string;
  content: string;
  instagramUrl: string;
  category: string;
  publishedAt: string;
};

const CATEGORIES = ["Tips", "Guides", "Investment", "Lifestyle"];

function Field({
  label, placeholder, value, onChange, optional = false,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
        {label}
        {optional && <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">(optional)</span>}
      </label>
      <input
        type="text" placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition"
      />
    </div>
  );
}

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
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
        <h3 className="text-lg font-extrabold text-white mb-2">Delete Post?</h3>
        <p className="text-gray-500 text-sm mb-7">This cannot be undone. The post will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition text-sm">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BlogAdmin({
  showToast,
}: {
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  const [blogView, setBlogView] = useState<"list" | "form">("list");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tips");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data);
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setSummary(""); setContent("");
    setCategory("Tips"); setInstagramUrl("");
  };

  const handleEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setTitle(p.title); setSummary(p.summary); setContent(p.content);
    setCategory(p.category); setInstagramUrl(p.instagramUrl);
    setBlogView("form");
  };

  const isValidInstagramUrl = (url: string) =>
    /instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/.test(url);

  const handleSubmit = async () => {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      showToast("Title, summary and content are required", "error"); return;
    }
    if (!isValidInstagramUrl(instagramUrl)) {
      showToast("Please enter a valid Instagram post URL", "error"); return;
    }
    setSubmitting(true);
    try {
      const body = { title, summary, content, category, instagramUrl };
      const res = await fetch("/api/blog", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...body } : body),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Post updated!" : "Post published!");
      resetForm();
      setBlogView("list");
      fetchPosts();
    } catch {
      showToast("Failed to save post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      showToast("Post deleted");
      setDeleteConfirmId(null);
      fetchPosts();
    } catch {
      showToast("Failed to delete post", "error");
    }
  };

  // Instagram URL preview
  const getEmbedPreview = (url: string) => {
    const clean = url.replace(/\/$/, "");
    const parts = clean.split("/");
    return parts[parts.length - 1] || parts[parts.length - 2] || "";
  };

  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <DeleteModal onConfirm={() => handleDelete(deleteConfirmId)} onCancel={() => setDeleteConfirmId(null)} />
        )}
      </AnimatePresence>

      {/* ── LIST VIEW ── */}
      {blogView === "list" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">Blog Posts</h2>
              <p className="text-gray-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""} published</p>
            </div>
            <button
              onClick={() => { resetForm(); setBlogView("form"); }}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm hover:scale-105"
            >
              <FaPlus size={11} /> New Post
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 text-sm py-10">
              <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
              Loading posts…
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 text-gray-600">
              <FaInstagram className="text-5xl mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No posts yet.</p>
              <p className="text-xs mt-1 text-gray-700">Click "New Post" to publish your first one.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group flex flex-col">
                  {/* Instagram gradient preview */}
                  <div className="p-0.5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                    <div className="bg-gray-900 h-32 flex flex-col items-center justify-center gap-2">
                      <FaInstagram className="text-3xl text-pink-400" />
                      <span className="text-gray-500 text-[10px] font-mono truncate max-w-[90%] px-2">
                        {getEmbedPreview(post.instagramUrl)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-pink-400 bg-pink-400/10 border border-pink-400/20 rounded-full px-2 py-0.5 w-fit mb-2">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-1">{post.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed flex-1">{post.summary}</p>
                    <p className="text-gray-600 text-[10px] mt-2">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      <a href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer" title="View"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition text-xs">
                        <FaEye />
                      </a>
                      <button onClick={() => handleEdit(post)} title="Edit"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-400 rounded-lg transition text-xs">
                        <FaEdit />
                      </button>
                      <button onClick={() => setDeleteConfirmId(post.id)} title="Delete"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition text-xs ml-auto">
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

      {/* ── FORM VIEW ── */}
      {blogView === "form" && (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold">{editingId ? "Edit Post" : "New Blog Post"}</h2>
              <p className="text-gray-500 text-sm mt-1">{editingId ? "Update the post details below." : "Fill in the details to publish a new post."}</p>
            </div>
            <button onClick={() => { resetForm(); setBlogView("list"); }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition">
              <FaTimes size={12} /> Cancel
            </button>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-8">

            {/* Category */}
            <div>
              <p className="text-xs font-bold text-pink-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-pink-400/50" /> Category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      category === cat
                        ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.25)]"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Content fields */}
            <div>
              <p className="text-xs font-bold text-pink-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-pink-400/50" /> Content
              </p>
              <div className="space-y-4">
                <Field label="Title" placeholder="e.g. 5 Things to Check Before Buying a Flat" value={title} onChange={setTitle} />
                <Field label="Summary" placeholder="A short 1–2 sentence summary shown on the blog card" value={summary} onChange={setSummary} />
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Full Content</label>
                  <textarea
                    value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="Write the full blog post content here. Use line breaks to separate paragraphs."
                    rows={10}
                    className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition resize-none leading-relaxed"
                  />
                  <p className="text-gray-600 text-xs mt-1.5 text-right">{content.length} characters</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Instagram URL */}
            <div>
              <p className="text-xs font-bold text-pink-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-pink-400/50" /> Instagram Post
              </p>
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-pink-500/20 rounded-2xl px-5 py-3 mb-4">
                <FaInstagram className="text-pink-400 text-lg flex-shrink-0" />
                <span className="text-sm text-gray-300 font-medium">Paste the link to any Instagram post, reel, or video</span>
              </div>
              <Field
                label="Instagram URL"
                placeholder="https://www.instagram.com/p/ABC123/"
                value={instagramUrl}
                onChange={setInstagramUrl}
              />
              <p className="text-gray-600 text-xs mt-2">
                Supports instagram.com/p/... · instagram.com/reel/... · instagram.com/tv/...
              </p>

              {/* Live URL validation feedback */}
              {instagramUrl.trim() && (
                <div className={`mt-3 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${
                  isValidInstagramUrl(instagramUrl)
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {isValidInstagramUrl(instagramUrl) ? <FaCheck size={10} /> : <FaTimes size={10} />}
                  {isValidInstagramUrl(instagramUrl) ? "Valid Instagram URL" : "Doesn't look like a valid Instagram post URL"}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm"
            >
              {submitting
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <FaCheck size={13} />}
              {submitting ? "Publishing…" : editingId ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}