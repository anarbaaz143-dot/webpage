"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────
interface BrochureButtonProps {
  projectName: string;
  location: string;
}

// ── Constants ────────────────────────────────────────────────
const WHATSAPP_NUMBER = "919702162636";

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Input field helper ────────────────────────────────────────
function FormField({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {error && (
        <p className="text-red-400 text-[11px] mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function BrochureButton({ projectName, location }: BrochureButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setName(""); setEmail(""); setPhone(""); setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const message = encodeURIComponent(
      `Hi, my name is ${name.trim()}.\nMy email is ${email.trim()} and my phone is ${phone.trim()}.\n\nI'm interested in the brochure for: ${projectName} located at ${location}.\n\nPlease share the brochure at your earliest convenience.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    handleClose();
  };

  const clearError = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: "" }));

  const inputClass = (key: string) =>
    `w-full bg-gray-800 border px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 transition ${
      errors[key]
        ? "border-red-500 focus:ring-red-500/30"
        : "border-white/10 focus:ring-amber-400/30 focus:border-amber-400/50"
    }`;

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 text-white hover:text-amber-400 font-bold py-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.02] text-sm"
      >
        <DownloadIcon className="w-4 h-4" />
        Download Brochure
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={handleClose}
        >
          <div
            className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "popIn 0.2s ease" }}
          >
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-300" />

            <div className="p-7 space-y-5">

              {/* ── Modal Header ── */}
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-amber-400 text-[10px] font-bold tracking-widest uppercase">
                    <DownloadIcon className="w-3 h-3" />
                    Download Brochure
                  </div>
                  <h3 className="text-white font-extrabold text-base leading-snug">{projectName}</h3>
                  <p className="text-gray-500 text-xs">{location}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition text-sm flex-shrink-0"
                >✕</button>
              </div>

              {/* ── Subtitle ── */}
              <p className="text-gray-400 text-xs leading-relaxed">
                Enter your details below and we'll send the brochure via WhatsApp instantly.
              </p>

              {/* ── Form Fields ── */}
              <div className="space-y-3">
                <FormField error={errors.name}>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) clearError("name"); }}
                    className={inputClass("name")}
                  />
                </FormField>

                <FormField error={errors.email}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) clearError("email"); }}
                    className={inputClass("email")}
                  />
                </FormField>

                <FormField error={errors.phone}>
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (errors.phone) clearError("phone"); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className={inputClass("phone")}
                  />
                </FormField>
              </div>

              {/* ── Submit ── */}
              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] text-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Send via WhatsApp & Download
                </button>
                <p className="text-center text-[10px] text-gray-600">
                  We'll send the brochure directly to your WhatsApp
                </p>
              </div>

            </div>
          </div>

          <style>{`
            @keyframes popIn {
              from { opacity: 0; transform: scale(0.94) translateY(8px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}