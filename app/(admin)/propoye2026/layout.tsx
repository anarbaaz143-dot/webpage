"use client";
import NewsAdmin from "./NewsAdmin";
import { FaNewspaper } from "react-icons/fa";
import { useEffect, useState } from "react";
import BlogAdmin from "./BlogAdmin";
import BuilderAdmin from "./BuilderAdmin";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome, FaPlus, FaCog, FaEdit, FaTrash, FaFire,
  FaTimes, FaCheck, FaUpload, FaEye, FaAlignLeft, FaYoutube, FaStar, FaBuilding,
} from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import FeedbackAdmin from "./FeedbackAdmin";

type Property = {
  id: number;
  propoyeId: string;
  projectName: string;
  projectArea: string;
  location: string;
  address: string;
  floors: number;
  towers: number;
  possessionDate: string;
  configuration: string;
  pricingStartsFrom: string;
  pricingEndsAt?: string;
  images: string[];
  floorPlans: string[];
  isTrending: boolean;
  isReadyToMove?: boolean;
  isUnderConstruction?: boolean;
  isNewLaunch?: boolean;
  description?: string;
  builderName?: string;
};

type Toast = { id: number; message: string; type: "success" | "error" };

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE COMPRESSION
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// FIELD & IMAGE UPLOAD — outside component to prevent focus-reset bug
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  label, placeholder, value, onChange, error, optional = false, type = "text",
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string; optional?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
        {label}
        {optional && <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">(optional)</span>}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-800 border px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 transition ${
          error ? "border-red-500 focus:ring-red-500/30" : "border-white/10 focus:ring-amber-400/30 focus:border-amber-400/50"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><FaTimes size={9} /> {error}</p>}
    </div>
  );
}

function ImageUploadBlock({
  label, inputId, previews, newFiles, onChange, onRemove, maxCount, error, isEditing,
}: {
  label: string; inputId: string; previews: string[]; newFiles: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void; maxCount: number; error?: string; isEditing: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
        {label}
        {isEditing && <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">(upload new to replace)</span>}
      </label>
      <label htmlFor={inputId}
        className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-7 cursor-pointer transition-all ${
          error ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-amber-400/40 hover:bg-amber-400/5"
        }`}>
        <FaUpload className="text-gray-500" />
        <span className="text-sm text-gray-400">
          {previews.length > 0
            ? `${newFiles.length > 0 ? newFiles.length : previews.length} file(s) — click to change`
            : `Click to upload (max ${maxCount})`}
        </span>
        <input id={inputId} type="file" multiple accept="image/*" onChange={onChange} className="hidden" />
      </label>
      {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><FaTimes size={9} /> {error}</p>}
      {previews.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {previews.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} className="w-24 h-20 object-cover rounded-xl border border-white/10" alt="" />
              {newFiles[i] && (
                <button onClick={() => onRemove(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
              )}
              {i === 0 && (
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">Cover</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESCRIPTION MODAL
// ─────────────────────────────────────────────────────────────────────────────

function DescriptionModal({
  property, onClose, onSaved,
}: {
  property: Property;
  onClose: () => void;
  onSaved: (id: number, description: string) => void;
}) {
  const [text, setText] = useState(property.description ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasExisting = !!(property.description?.trim());

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/property", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: property.id, description: text }),
      });
      if (!res.ok) throw new Error();
      onSaved(property.id, text);
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const deleteDescription = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/property", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: property.id, description: "" }),
      });
      if (!res.ok) throw new Error();
      onSaved(property.id, "");
      onClose();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
              <FaAlignLeft size={10} /> Description
            </div>
            <h3 className="text-lg font-extrabold text-white leading-snug">{property.projectName}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{property.location}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition text-sm">
            <FaTimes />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a detailed description about this property — location highlights, amenities, connectivity, lifestyle, developer info, etc."
          rows={9}
          className="w-full bg-gray-800 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition resize-none leading-relaxed"
        />
        <p className="text-gray-600 text-xs mt-1.5 text-right">{text.length} characters</p>
        <div className="flex gap-3 mt-5">
          {hasExisting && (
            <button onClick={deleteDescription} disabled={deleting}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold rounded-xl transition text-sm disabled:opacity-50">
              {deleting ? <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <FaTrash size={11} />}
              Delete
            </button>
          )}
          <button onClick={onClose} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition text-sm ml-auto">
            Cancel
          </button>
          <button onClick={save} disabled={saving || !text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold rounded-xl transition text-sm">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <FaCheck size={11} />}
            {hasExisting ? "Update" : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YOUTUBE URL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const YT_PATTERNS = [
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

function getEmbedUrl(url: string): string {
  for (const p of YT_PATTERNS) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
  }
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const [view, setView] = useState<"dashboard" | "add" | "manage" | "youtube" | "news" | "blog" | "feedback" | "builders">("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [descriptionModalProperty, setDescriptionModalProperty] = useState<Property | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ── YouTube state (3 videos) ──────────────────────────────
  const [youtubeUrls, setYoutubeUrls] = useState<Record<1 | 2 | 3, string>>({ 1: "", 2: "", 3: "" });
  const [youtubeSaving, setYoutubeSaving] = useState<Record<1 | 2 | 3, boolean>>({ 1: false, 2: false, 3: false });
  const [youtubeLoaded, setYoutubeLoaded] = useState(false);

  // ── Property form fields ──────────────────────────────────
  const [propoyeId, setPropoyeId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectArea, setProjectArea] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [floors, setFloors] = useState("");
  const [towers, setTowers] = useState("");
  const [possessionDate, setPossessionDate] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [pricingStartsFrom, setPricingStartsFrom] = useState("");
  const [pricingEndsAt, setPricingEndsAt] = useState("");
  const [builderName, setBuilderName] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
  const [floorPlanPreviewUrls, setFloorPlanPreviewUrls] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
    setImagePreviewUrls(files.map((f) => URL.createObjectURL(f)));
    if (formErrors.images) setFormErrors((p) => ({ ...p, images: "" }));
  };

  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    setFloorPlanFiles(files);
    setFloorPlanPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    setImages((p) => p.filter((_, i) => i !== index));
    setImagePreviewUrls((p) => p.filter((_, i) => i !== index));
  };

  const removeFloorPlan = (index: number) => {
    setFloorPlanFiles((p) => p.filter((_, i) => i !== index));
    setFloorPlanPreviewUrls((p) => p.filter((_, i) => i !== index));
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/property");
      const data = await res.json();
      setProperties(data);
    } catch {
      showToast("Failed to load properties", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "manage" || view === "dashboard") fetchProperties();
  }, [view]);

  // Load YouTube URLs when tab opens (once)
  useEffect(() => {
    if (view === "youtube" && !youtubeLoaded) {
      Promise.all(
        ([1, 2, 3] as const).map((n) =>
          fetch(`/api/settings?key=home_youtube_url_${n}`).then((r) => r.json())
        )
      ).then(([d1, d2, d3]) => {
        setYoutubeUrls({ 1: d1.value || "", 2: d2.value || "", 3: d3.value || "" });
        setYoutubeLoaded(true);
      });
    }
  }, [view, youtubeLoaded]);

  const saveYoutubeUrl = async (num: 1 | 2 | 3, overrideValue?: string) => {
    const value = overrideValue !== undefined ? overrideValue : youtubeUrls[num];
    setYoutubeSaving((prev) => ({ ...prev, [num]: true }));
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: `home_youtube_url_${num}`, value }),
      });
      if (!res.ok) throw new Error();
      showToast(`Video ${num} saved!`);
    } catch {
      showToast("Failed to save link", "error");
    } finally {
      setYoutubeSaving((prev) => ({ ...prev, [num]: false }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!propoyeId.trim()) errors.propoyeId = "Propoye ID is required";
    if (!projectName.trim()) errors.projectName = "Project name is required";
    if (!projectArea.trim()) errors.projectArea = "Project area is required";
    if (!location.trim()) errors.location = "Location is required";
    if (!address.trim()) errors.address = "Address is required";
    if (!floors || isNaN(Number(floors))) errors.floors = "Valid number required";
    if (!towers || isNaN(Number(towers))) errors.towers = "Valid number required";
    if (!possessionDate.trim()) errors.possessionDate = "Possession date is required";
    if (!configuration.trim()) errors.configuration = "Configuration is required";
    if (!pricingStartsFrom.trim()) errors.pricingStartsFrom = "Pricing is required";
    if (!editingId && images.length === 0) errors.images = "At least one property image is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const resetForm = () => {
  setPropoyeId(""); setProjectName(""); setProjectArea("");
  setLocation(""); setAddress(""); setFloors(""); setTowers("");
  setPossessionDate(""); setConfiguration(""); setPricingStartsFrom("");
  setBuilderName(""); // ← add this
  setPricingEndsAt("");
  setImages([]); setImagePreviewUrls([]);
  setFloorPlanFiles([]); setFloorPlanPreviewUrls([]);
  setEditingId(null); setFormErrors({});
};

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    setCompressing(true);
    const compressed = await Promise.all(files.map((f) => compressImage(f)));
    setCompressing(false);
    const formData = new FormData();
    compressed.forEach((f) => formData.append("images", f));
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.images;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const uploadedImages = await uploadFiles(images);
      const uploadedFloorPlans = await uploadFiles(floorPlanFiles);
      const body: any = {
        propoyeId, projectName, projectArea, location, address,
        floors: Number(floors), towers: Number(towers),
        possessionDate, configuration, pricingStartsFrom,
        builderName,pricingEndsAt,
        ...(uploadedImages.length > 0 && { images: uploadedImages }),
        ...(uploadedFloorPlans.length > 0 && { floorPlans: uploadedFloorPlans }),
      };
      const res = await fetch("/api/property", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...body } : body),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast(editingId ? "Property updated!" : "Property added!");
      resetForm();
      setView("manage");
    } catch (err: any) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
      setCompressing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/property", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      showToast("Property deleted");
      setDeleteConfirmId(null);
      fetchProperties();
    } catch {
      showToast("Failed to delete property", "error");
    }
  };

  const toggleTrending = async (property: Property) => {
    try {
      const res = await fetch("/api/property", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: property.id, isTrending: !property.isTrending }),
      });
      if (!res.ok) throw new Error();
      showToast(property.isTrending ? "Removed from trending" : "Added to trending");
      fetchProperties();
    } catch {
      showToast("Failed to update trending", "error");
    }
  };

  const toggleReadyToMove = async (property: Property) => {
  try {
    const res = await fetch("/api/property", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: property.id, isReadyToMove: !property.isReadyToMove }),
    });
    if (!res.ok) throw new Error();
    showToast(property.isReadyToMove ? "Removed Ready to Move" : "Marked Ready to Move");
    fetchProperties();
  } catch {
    showToast("Failed to update", "error");
  }
};

const toggleUnderConstruction = async (property: Property) => {
  try {
    const res = await fetch("/api/property", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: property.id, isUnderConstruction: !property.isUnderConstruction }),
    });
    if (!res.ok) throw new Error();
    showToast(property.isUnderConstruction ? "Removed Under Construction" : "Marked Under Construction");
    fetchProperties();
  } catch {
    showToast("Failed to update", "error");
  }
};

const toggleNewLaunch = async (property: Property) => {
  try {
    const res = await fetch("/api/property", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: property.id, isNewLaunch: !property.isNewLaunch }),
    });
    if (!res.ok) throw new Error();
    showToast(property.isNewLaunch ? "Removed New Launch" : "Marked as New Launch");
    fetchProperties();
  } catch {
    showToast("Failed to update", "error");
  }
};

  const handleEdit = (p: Property) => {
    setEditingId(p.id);
    setPropoyeId(p.propoyeId); setProjectName(p.projectName); setProjectArea(p.projectArea);
    setLocation(p.location); setAddress(p.address);
    setFloors(String(p.floors)); setTowers(String(p.towers));
    setPossessionDate(p.possessionDate); setConfiguration(p.configuration);
    setPricingStartsFrom(p.pricingStartsFrom);
    setPricingEndsAt(p.pricingEndsAt || "");
    setImages([]); setImagePreviewUrls(p.images || []);
    setFloorPlanFiles([]); setFloorPlanPreviewUrls(p.floorPlans || []);
    setFormErrors({});
    setBuilderName(p.builderName || "");
    setView("add");
  };

  const handleDescriptionSaved = (id: number, description: string) => {
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, description } : p));
    showToast(description ? "Description saved!" : "Description removed");
  };

  const mkChange = (setter: (v: string) => void, key: string) => (v: string) => {
    setter(v);
    if (formErrors[key]) setFormErrors((p) => ({ ...p, [key]: "" }));
  };

  const filtered = properties.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.propoyeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingCount = properties.filter((p) => p.isTrending).length;

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { key: "add", label: "Add Property", icon: <FaPlus /> },
    { key: "manage", label: "Manage", icon: <FaCog /> },
    { key: "youtube", label: "Home YouTube", icon: <FaYoutube /> },
    { key: "news", label: "News", icon: <FaNewspaper /> },
    { key: "blog", label: "Blog", icon: <FaInstagram /> },
    { key: "feedback", label: "Edit Feedback", icon: <FaStar /> },
    { key: "builders", label: "Builders", icon: <FaBuilding /> },
  ];

  const submitLabel = compressing ? "Compressing images…" : submitting ? (editingId ? "Updating…" : "Adding…") : (editingId ? "Update Property" : "Add Property");

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── Toasts ── */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl pointer-events-auto ${t.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              {t.type === "success" ? <FaCheck /> : <FaTimes />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Description Modal ── */}
      <AnimatePresence>
        {descriptionModalProperty && (
          <DescriptionModal
            property={descriptionModalProperty}
            onClose={() => setDescriptionModalProperty(null)}
            onSaved={handleDescriptionSaved}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-gray-900 border-r border-white/5 flex flex-col py-8 px-4">
        <div className="mb-10 px-2">
          <div className="text-xs text-gray-500 tracking-widest uppercase font-bold mb-1">PROPOYE</div>
          <div className="text-lg font-extrabold text-white">Admin Panel</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button key={item.key}
              onClick={() => { if (item.key !== "add") resetForm(); setView(item.key as any); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                view === item.key ? "bg-amber-400 text-gray-900 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.key === "add" && editingId ? "Edit Property" : item.label}
            </button>
          ))}
        </nav>
<div className="mt-auto pt-6 border-t border-white/5 px-2 space-y-3">
  <div className="flex justify-between text-xs text-gray-500"><span>Total</span><span className="text-white font-bold">{properties.length}</span></div>
  <div className="flex justify-between text-xs text-gray-500"><span>Trending</span><span className="text-amber-400 font-bold">{trendingCount}</span></div>
  <button
    onClick={async () => {
      await fetch("/api/propoye2026-login", { method: "POST" });
      window.location.href = "/propoye2026-login";
    }}
    className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold rounded-xl transition text-sm"
  >
    <FaTimes size={11} /> Logout
  </button>
</div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-white/5 px-10 py-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-400 capitalize">{view === "add" && editingId ? "Edit Property" : view}</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">

            {/* ── DASHBOARD ── */}
            {view === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-extrabold mb-1">Welcome back 👋</h2>
                  <p className="text-gray-500 text-sm">Here's a quick overview of your listings.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Properties", value: properties.length, color: "border-blue-500/30 bg-blue-500/5" },
                    { label: "Trending", value: trendingCount, color: "border-amber-400/30 bg-amber-400/5" },
                    { label: "Non-Trending", value: properties.length - trendingCount, color: "border-gray-500/30 bg-white/5" },
                    { label: "Avg Floors", value: properties.length ? Math.round(properties.reduce((a, p) => a + p.floors, 0) / properties.length) : 0, color: "border-green-500/30 bg-green-500/5" },
                  ].map((s) => (
                    <div key={s.label} className={`border ${s.color} rounded-2xl p-5`}>
                      <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                      <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Recent Properties</h3>
                  {loading ? <p className="text-gray-600 text-sm">Loading…</p> : (
                    <div className="grid md:grid-cols-3 gap-4">
                      {properties.slice(0, 3).map((p) => (
                        <div key={p.id} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
                          <img src={p.images?.[0]} alt={p.projectName} className="h-32 w-full object-cover" />
                          <div className="p-4">
                            <div className="font-semibold text-sm text-white truncate">{p.projectName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{p.location}</div>
                            <div className="text-xs text-amber-400 font-semibold mt-1">{p.pricingStartsFrom}</div>
                            {p.isTrending && <span className="inline-block mt-2 text-[10px] bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full px-2 py-0.5 font-bold">🔥 Trending</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── ADD / EDIT ── */}
            {view === "add" && (
              <motion.div key="add" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-extrabold">{editingId ? "Edit Property" : "Add New Property"}</h2>
                    <p className="text-gray-500 text-sm mt-1">{editingId ? "Update the details below." : "Fill in all details to list a new property."}</p>
                  </div>
                  {editingId && (
                    <button onClick={() => { resetForm(); setView("manage"); }}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition">
                      <FaTimes size={12} /> Cancel
                    </button>
                  )}
                </div>
                <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-8">
                  <div>
                    <p className="text-xs font-bold text-amber-400 tracking-widests uppercase mb-4 flex items-center gap-2"><span className="w-4 h-px bg-amber-400/50" /> Identity</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Propoye ID" placeholder="e.g. PRP-001" value={propoyeId} onChange={mkChange(setPropoyeId, "propoyeId")} error={formErrors.propoyeId} />
                      <Field label="Project Name" placeholder="e.g. Sunset Heights" value={projectName} onChange={mkChange(setProjectName, "projectName")} error={formErrors.projectName} />
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2"><span className="w-4 h-px bg-amber-400/50" /> Location</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Location" placeholder="e.g. Bandra, Mumbai" value={location} onChange={mkChange(setLocation, "location")} error={formErrors.location} />
                      <Field label="Project Area" placeholder="e.g. Andheri West" value={projectArea} onChange={mkChange(setProjectArea, "projectArea")} error={formErrors.projectArea} />
                    </div>
                    <div className="mt-4">
                      <Field label="Full Address" placeholder="e.g. Plot 12, SV Road, Andheri West, Mumbai 400058" value={address} onChange={mkChange(setAddress, "address")} error={formErrors.address} />
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2"><span className="w-4 h-px bg-amber-400/50" /> Project Details</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Floors" placeholder="e.g. 24" value={floors} onChange={mkChange(setFloors, "floors")} error={formErrors.floors} type="number" />
                      <Field label="Towers" placeholder="e.g. 3" value={towers} onChange={mkChange(setTowers, "towers")} error={formErrors.towers} type="number" />
                      <Field label="Possession Date" placeholder="e.g. Dec 2026" value={possessionDate} onChange={mkChange(setPossessionDate, "possessionDate")} error={formErrors.possessionDate} />
                      <Field label="Configuration" placeholder="e.g. 2BHK, 3BHK" value={configuration} onChange={mkChange(setConfiguration, "configuration")} error={formErrors.configuration} />
                    </div>
                    <div className="mt-4">
                      <Field label="Pricing Starts From" placeholder="e.g. ₹1.2 Cr" value={pricingStartsFrom} onChange={mkChange(setPricingStartsFrom, "pricingStartsFrom")} error={formErrors.pricingStartsFrom} />
                    </div>
                    <div className="mt-4">
  <Field
    label="Pricing Ends At"
    placeholder="e.g. ₹2.5 Cr"
    value={pricingEndsAt}
    onChange={mkChange(setPricingEndsAt, "pricingEndsAt")}
    optional={true}
  />
</div>

<div className="mt-4">
  <Field 
    label="Builder Name" 
    placeholder="e.g. Lodha Group" 
    value={builderName} 
    onChange={mkChange(setBuilderName, "builderName")}
    optional={true}
  />
</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2"><span className="w-4 h-px bg-amber-400/50" /> Media</p>
                    <div className="space-y-6">
                      <ImageUploadBlock label="Property Images (max 5)" inputId="imageUpload" previews={imagePreviewUrls} newFiles={images} onChange={handleImageChange} onRemove={removeImage} maxCount={5} error={formErrors.images} isEditing={!!editingId} />
                      <ImageUploadBlock label="Floor Plans (max 10)" inputId="floorPlanUpload" previews={floorPlanPreviewUrls} newFiles={floorPlanFiles} onChange={handleFloorPlanChange} onRemove={removeFloorPlan} maxCount={10} isEditing={!!editingId} />
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={submitting || compressing}
                    className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] text-sm">
                    {(submitting || compressing) && <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />}
                    {!submitting && !compressing && <FaCheck size={13} />}
                    {submitLabel}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── MANAGE ── */}
            {view === "manage" && (
              <motion.div key="manage" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold">All Properties</h2>
                    <p className="text-gray-500 text-sm mt-1">{properties.length} total · {trendingCount} trending</p>
                  </div>
                  <input type="text" placeholder="Search by name, location or ID…" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900 border border-white/10 text-sm text-white placeholder-gray-600 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition w-full md:w-72" />
                </div>
                {loading ? (
                  <div className="flex items-center gap-3 text-gray-500 text-sm py-10">
                    <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    Loading properties…
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-20 text-gray-600">
                    <FaHome className="text-4xl mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{searchTerm ? "No properties match your search." : "No properties yet."}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((property) => (
                      <div key={property.id} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group flex flex-col">
                        <div className="relative overflow-hidden h-36">
                          <img src={property.images?.[0]} alt={property.projectName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {property.isTrending && (
                            <div className="absolute top-2 left-2 bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">🔥 Trending</div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10">
                            {property.propoyeId}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h2 className="font-bold text-white text-sm truncate">{property.projectName}</h2>
                          <p className="text-gray-500 text-xs mt-0.5">{property.location}</p>
                          <p className="text-amber-400 text-xs font-semibold mt-1">{property.pricingStartsFrom}</p>
                          <div className="flex flex-wrap gap-1 mt-2 mb-3">
                            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">{property.configuration}</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">{property.floors}F · {property.towers}T</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">📅 {property.possessionDate}</span>
                          </div>
                          <button
                            onClick={() => setDescriptionModalProperty(property)}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border transition mb-3 ${
                              property.description?.trim()
                                ? "bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <FaAlignLeft size={10} />
                            {property.description?.trim() ? "Edit Description" : "Add Description"}
                          </button>

                          <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
  <a href={`/property/${property.id}`} target="_blank" rel="noopener noreferrer" title="View"
    className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition text-xs"><FaEye /></a>
  <button onClick={() => handleEdit(property)} title="Edit"
    className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-amber-400/20 text-gray-400 hover:text-amber-400 rounded-lg transition text-xs"><FaEdit /></button>
  <button onClick={() => toggleReadyToMove(property)} title={property.isReadyToMove ? "Remove Ready to Move" : "Mark Ready to Move"}
    className={`flex items-center justify-center w-8 h-8 rounded-lg transition text-xs font-bold ${property.isReadyToMove ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-white/5 text-gray-500 hover:bg-green-500/10 hover:text-green-400"}`}>
    ✓</button>
  <button onClick={() => toggleUnderConstruction(property)} title={property.isUnderConstruction ? "Remove Under Construction" : "Mark Under Construction"}
    className={`flex items-center justify-center w-8 h-8 rounded-lg transition text-xs ${property.isUnderConstruction ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" : "bg-white/5 text-gray-500 hover:bg-orange-500/10 hover:text-orange-400"}`}>
    🏗</button>
  <button onClick={() => toggleNewLaunch(property)} title={property.isNewLaunch ? "Remove New Launch" : "Mark New Launch"}
    className={`flex items-center justify-center w-8 h-8 rounded-lg transition text-xs ${property.isNewLaunch ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-white/5 text-gray-500 hover:bg-blue-500/10 hover:text-blue-400"}`}>
    🚀</button>
  <button onClick={() => toggleTrending(property)} title={property.isTrending ? "Remove from trending" : "Add to trending"}
    className={`flex items-center justify-center w-8 h-8 rounded-lg transition text-xs ${property.isTrending ? "bg-amber-400/20 text-amber-400 hover:bg-amber-400/30" : "bg-white/5 text-gray-500 hover:bg-amber-400/10 hover:text-amber-400"}`}>
    <FaFire /></button>
  <button onClick={() => setDeleteConfirmId(property.id)} title="Delete"
    className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition text-xs ml-auto"><FaTrash /></button>
</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── YOUTUBE ── */}
            {view === "youtube" && (
              <motion.div key="youtube" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-extrabold">Home YouTube Videos</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Add up to 3 YouTube videos. They'll appear as a carousel on the home page.
                  </p>
                </div>

                <div className="space-y-6">
                  {([1, 2, 3] as const).map((num) => {
                    const url = youtubeUrls[num];
                    const saving = youtubeSaving[num];
                    const embedUrl = getEmbedUrl(url);

                    return (
                      <div key={num} className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-5">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                            <FaYoutube size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Video {num}</p>
                            <p className="text-xs text-gray-500">{url.trim() ? "Active" : "Not set"}</p>
                          </div>
                          {url.trim() && embedUrl && (
                            <span className="ml-auto text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full">✓ Valid</span>
                          )}
                          {url.trim() && !embedUrl && (
                            <span className="ml-auto text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2.5 py-1 rounded-full">Invalid URL</span>
                          )}
                        </div>

                        {/* URL input */}
                        <div>
                          <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Video URL</label>
                          <input
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={url}
                            onChange={(e) => setYoutubeUrls((prev) => ({ ...prev, [num]: e.target.value }))}
                            className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition"
                          />
                          <p className="text-gray-600 text-xs mt-1.5">
                            Supports youtube.com/watch?v=... · youtu.be/... · youtube.com/shorts/...
                          </p>
                        </div>

                        {/* Live preview */}
                        {embedUrl && (
                          <div>
                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Preview</p>
                            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-gray-800">
                              <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={`Preview ${num}`} />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => saveYoutubeUrl(num)}
                            disabled={saving || !url.trim()}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 text-sm"
                          >
                            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaCheck size={12} />}
                            {saving ? "Saving…" : "Save"}
                          </button>
                          {url.trim() && (
                            <button
                              onClick={() => {
                                setYoutubeUrls((prev) => ({ ...prev, [num]: "" }));
                                saveYoutubeUrl(num, "");
                              }}
                              className="px-4 flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-400 hover:text-red-400 font-semibold rounded-xl transition text-sm"
                              title="Remove"
                            >
                              <FaTimes size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── NEWS ── */}
            {view === "news" && (
              <NewsAdmin showToast={showToast} />
            )}

            {/* ── BLOG ── */}
            {view === "blog" && (
              <BlogAdmin showToast={showToast} />
            )}
            
            {/* ── Feedback ── */}
            {view === "feedback" && (
              <FeedbackAdmin showToast={showToast} />
            )}

            {view === "builders" && (
              <BuilderAdmin showToast={showToast} />
              )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Delete modal ── */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 text-xl mb-5"><FaTrash /></div>
              <h3 className="text-lg font-extrabold text-white mb-2">Delete Property?</h3>
              <p className="text-gray-500 text-sm mb-7">This action cannot be undone. The property will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition text-sm">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition text-sm">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}