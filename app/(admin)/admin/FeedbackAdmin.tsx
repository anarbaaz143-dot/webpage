"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaStar, FaRegStar } from "react-icons/fa";

type FeedbackSlot = {
  slot: number;
  name: string;
  rating: number;
  description: string;
};

const EMPTY_SLOT = (slot: number): FeedbackSlot => ({
  slot,
  name: "",
  rating: 5,
  description: "",
});

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-100 hover:scale-110"
        >
          {star <= (hovered || value) ? (
            <FaStar className="text-amber-400 text-lg" />
          ) : (
            <FaRegStar className="text-gray-600 text-lg" />
          )}
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-400 font-semibold">
        {hovered || value}/5
      </span>
    </div>
  );
}

export default function FeedbackAdmin({
  showToast,
}: {
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  const [slots, setSlots] = useState<FeedbackSlot[]>([
    EMPTY_SLOT(1),
    EMPTY_SLOT(2),
    EMPTY_SLOT(3),
    EMPTY_SLOT(4),
  ]);
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/feedback")
    .then((r) => r.json())
    .then((data: FeedbackSlot[]) => {
      if (!Array.isArray(data)) return;
      setSlots((prev) =>
        prev.map((s) => {
          const found = data.find((d) => d.slot === s.slot);
          return found ? { ...s, ...found } : s;
        })
      );
    })
    .catch(() => showToast("Failed to load feedback", "error"))
    .finally(() => setLoading(false));
}, []);

  const updateSlot = (slot: number, field: keyof FeedbackSlot, value: string | number) => {
    setSlots((prev) =>
      prev.map((s) => (s.slot === slot ? { ...s, [field]: value } : s))
    );
  };

  const saveSlot = async (slot: number) => {
    const s = slots.find((s) => s.slot === slot)!;
    if (!s.name.trim() || !s.description.trim()) {
      showToast("Name and description are required", "error");
      return;
    }
    setSaving((prev) => ({ ...prev, [slot]: true }));
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error();
      showToast(`Slot ${slot} saved!`);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving((prev) => ({ ...prev, [slot]: false }));
    }
  };

  const clearSlot = async (slot: number) => {
    setSaving((prev) => ({ ...prev, [slot]: true }));
    try {
      const res = await fetch("/api/feedback", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error();
      setSlots((prev) =>
        prev.map((s) => (s.slot === slot ? EMPTY_SLOT(slot) : s))
      );
      showToast(`Slot ${slot} cleared`);
    } catch {
      showToast("Failed to clear", "error");
    } finally {
      setSaving((prev) => ({ ...prev, [slot]: false }));
    }
  };

  return (
    <motion.div
      key="feedback"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold">Customer Feedback</h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill in all 4 slots — they appear as testimonial cards on the home page.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 text-sm py-10">
          <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
          Loading feedback…
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {slots.map((s) => {
            const isFilled = s.name.trim() && s.description.trim();
            return (
              <div
                key={s.slot}
                className="bg-gray-900 border border-white/5 rounded-3xl p-6 space-y-5"
              >
                {/* Slot header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-extrabold text-sm flex-shrink-0">
                    {s.slot}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Customer {s.slot}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isFilled ? "Active" : "Empty slot"}
                    </p>
                  </div>
                  {isFilled && (
                    <span className="ml-auto text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full">
                      ✓ Live
                    </span>
                  )}
                </div>

                <div className="h-px bg-white/5" />

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={s.name}
                    onChange={(e) => updateSlot(s.slot, "name", e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition"
                  />
                </div>

                {/* Star rating */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                    Rating
                  </label>
                  <StarPicker
                    value={s.rating}
                    onChange={(v) => updateSlot(s.slot, "rating", v)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                    Feedback
                  </label>
                  <textarea
                    placeholder="What did this customer say about Propoye?"
                    value={s.description}
                    onChange={(e) =>
                      updateSlot(s.slot, "description", e.target.value)
                    }
                    rows={4}
                    className="w-full bg-gray-800 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition resize-none leading-relaxed"
                  />
                  <p className="text-gray-600 text-xs mt-1 text-right">
                    {s.description.length} characters
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => saveSlot(s.slot)}
                    disabled={saving[s.slot]}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition-all duration-300 text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                  >
                    {saving[s.slot] ? (
                      <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                    ) : (
                      <FaCheck size={12} />
                    )}
                    {saving[s.slot] ? "Saving…" : "Save"}
                  </button>

                  {isFilled && (
                    <button
                      onClick={() => clearSlot(s.slot)}
                      disabled={saving[s.slot]}
                      className="px-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-400 hover:text-red-400 font-semibold rounded-xl transition text-sm"
                      title="Clear slot"
                    >
                      <FaTimes size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}