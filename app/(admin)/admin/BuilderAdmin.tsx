"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload, FaBuilding,
} from "react-icons/fa";

type Builder = {
  id: number;
  name: string;
  description: string;
  image: string;
  established?: string;
  projectsCount?: string;
};

async function compressImage(file: File, maxWidthPx = 1200, maxSizeMB = 3): Promise<File> {
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
        <h3 className="text-lg font-extrabold text-white mb-2">Delete Builder?</h3>
        <p className="text-gray-500 text-sm mb-7">This cannot be undone. The builder will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition text-sm">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
        className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition"
      />
    </div>
  );
}

export default function BuilderAdmin({
  showToast,
}: {
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  const [builderView, setBuilderView] = useState<"list" | "form">("list");
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [established, setEstablished] = useState("");
  const [projectsCount, setProjectsCount] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchBuilders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/builders");
      const data = await res.json();
      setBuilders(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load builders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBuilders(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setName(""); setDescription(""); setEstablished(""); setProjectsCount("");
    setImageFile(null); setImagePreview("");
  };

  const handleEdit = (b: Builder) => {
    setEditingId(b.id);
    setName(b.name); setDescription(b.description);
    setEstablished(b.established || ""); setProjectsCount(b.projectsCount || "");
    setImagePreview(b.image); setImageFile(null);
    setBuilderView("form");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

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

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      showToast("Name and description are required", "error");
      return;
    }
    if (!editingId && !imageFile) {
      showToast("A builder logo/photo is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const body: any = {
        name, description, image: imageUrl,
        ...(established.trim() && { established }),
        ...(projectsCount.trim() && { projectsCount }),
      };

      const res = await fetch("/api/builders", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...body } : body),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Builder updated!" : "Builder added!");
      resetForm();
      setBuilderView("list");
      fetchBuilders();
    } catch {
      showToast("Failed to save builder", "error");
    } finally {
      setSubmitting(false);
      setCompressing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch("/api/builders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      showToast("Builder deleted");
      setDeleteConfirmId(null);
      fetchBuilders();
    } catch {
      showToast("Failed to delete builder", "error");
    }
  };

  const submitLabel = compressing ? "Compressing…" : submitting
    ? (editingId ? "Updating…" : "Adding…")
    : (editingId ? "Update Builder" : "Add Builder");

  return (
    <motion.div
      key="builders"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <DeleteModal
            onConfirm={() => handleDelete(deleteConfirmId)}
            onCancel={() => setDeleteConfirmId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── LIST VIEW ── */}
      {builderView === "list" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">Builders</h2>
              <p className="text-gray-500 text-sm mt-1">
                {builders.length} builder{builders.length !== 1 ? "s" : ""} listed
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setBuilderView("form"); }}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
              <FaPlus size={11} /> Add Builder
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 text-sm py-10">
              <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
              Loading builders…
            </div>
          ) : builders.length === 0 ? (
            <div className="text-center py-24 text-gray-600">
              <FaBuilding className="text-5xl mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No builders yet.</p>
              <p className="text-xs mt-1 text-gray-700">Click "Add Builder" to list your first one.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {builders.map((b) => (
                <div key={b.id} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group flex flex-col">
                  {/* Logo */}
                  <div className="h-36 bg-gray-800 flex items-center justify-center overflow-hidden relative">
                    {b.image ? (
                      <img
                        src={b.image} alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <FaBuilding className="text-4xl text-gray-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-white text-sm">{b.name}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed flex-1">{b.description}</p>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {b.established && (
                        <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                          Est. {b.established}
                        </span>
                      )}
                      {b.projectsCount && (
                        <span className="text-[10px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">
                          {b.projectsCount} Projects
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      <button
                        onClick={() => handleEdit(b)} title="Edit"
                        className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-amber-400/20 text-gray-400 hover:text-amber-400 rounded-lg transition text-xs"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(b.id)} title="Delete"
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

      {/* ── FORM VIEW ── */}
      {builderView === "form" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold">{editingId ? "Edit Builder" : "Add Builder"}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {editingId ? "Update builder details below." : "Fill in the details to add a new builder."}
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setBuilderView("list"); }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition"
            >
              <FaTimes size={12} /> Cancel
            </button>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-8">

            {/* Basic info */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Builder Info
              </p>
              <div className="space-y-4">
                <Field label="Builder Name" placeholder="e.g. Lodha Group" value={name} onChange={setName} />
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the builder — history, speciality, notable projects, etc."
                    rows={4}
                    className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition resize-none leading-relaxed"
                  />
                  <p className="text-gray-600 text-xs mt-1 text-right">{description.length} characters</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Optional stats */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Stats
                <span className="text-gray-600 normal-case tracking-normal font-normal text-xs">(optional)</span>
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Established Year" placeholder="e.g. 1980" value={established} onChange={setEstablished} optional />
                <Field label="Projects Count" placeholder="e.g. 50+ or 120" value={projectsCount} onChange={setProjectsCount} optional />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Image upload */}
            <div>
              <p className="text-xs font-bold text-amber-400 tracking-widests uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50" /> Logo / Photo
                {editingId && <span className="text-gray-600 normal-case tracking-normal font-normal text-xs">(upload new to replace)</span>}
              </p>
              <label
                htmlFor="builderImageUpload"
                className="flex items-center justify-center gap-3 border-2 border-dashed border-white/10 hover:border-amber-400/40 hover:bg-amber-400/5 rounded-2xl py-7 cursor-pointer transition-all"
              >
                <FaUpload className="text-gray-500" />
                <span className="text-sm text-gray-400">
                  {imagePreview
                    ? imageFile ? "1 file selected — click to change" : "Existing image — click to replace"
                    : "Click to upload logo or photo"}
                </span>
                <input id="builderImageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>

              {imagePreview && (
                <div className="mt-4 relative inline-block group">
                  <img src={imagePreview} alt="Preview" className="w-32 h-24 object-cover rounded-xl border border-white/10" />
                  {imageFile && (
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(""); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >✕</button>
                  )}
                </div>
              )}
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