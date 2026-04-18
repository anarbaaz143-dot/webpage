"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadBot() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"welcome" | "phone">("welcome");

  const [message1, setMessage1] = useState(false);
  const [message2, setMessage2] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Auto open after 5 sec
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Welcome flow animation
  useEffect(() => {
    if (open && step === "welcome") {
      setTyping(true);

      const t1 = setTimeout(() => { setTyping(false); setMessage1(true); }, 1500);
      const t2 = setTimeout(() => { setTyping(true); }, 2500);
      const t3 = setTimeout(() => { setTyping(false); setMessage2(true); }, 4000);
      const t4 = setTimeout(() => { setShowOptions(true); }, 4500);

      return () => {
        clearTimeout(t1); clearTimeout(t2);
        clearTimeout(t3); clearTimeout(t4);
      };
    }
  }, [open, step]);

  const handleRedirect = () => {
    if (!phone) return;

    const yourNumber = "919702162636";
    const message = encodeURIComponent("Hello, I want help regarding houses");
    window.open(`https://wa.me/${yourNumber}?text=${message}`, "_blank");

    setPhone("");
    setOpen(false);
    setStep("welcome");
    setMessage1(false);
    setMessage2(false);
    setShowOptions(false);
    setSelectedOption(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOptionClick = (label: string) => {
    setSelectedOption(label);
    setStep("phone");
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Open chat"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
<span className="relative flex items-center justify-center w-16 h-16 bg-gray-900 hover:bg-amber-400 rounded-full shadow-2xl overflow-hidden">
  <img src="/ai_face.png" alt="Assistant" className="w-full h-full object-cover rounded-full" />
</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Box ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-6 right-6 w-[360px] z-50 rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)] border border-white/10"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >

            {/* Header */}
            <div className="bg-gray-950 px-5 py-4 flex items-center gap-3 relative overflow-hidden">
              {/* Subtle dot grid */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

              {/* Avatar */}
              <div className="relative flex-shrink-0">
<div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg">
  <img src="/ai_face.png" alt="Assistant" className="w-full h-full object-cover" />
</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-950" />
              </div>

              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-white font-bold text-sm truncate">
                  PROPOYE Assistant
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-gray-400 text-xs">Online · Typically replies instantly</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200"
              >
                <FaTimes size={12} />
              </button>
            </div>

            {/* Chat body */}
            <div className="bg-[#f0ece4] px-4 py-5 space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto">

              {/* Date chip */}
              <div className="flex justify-center">
                <span className="text-[10px] text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
<div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
  <img src="/ai_face.png" alt="Assistant" className="w-full h-full object-cover" />
</div>
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message 1 */}
              <AnimatePresence>
                {message1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-gray-900 text-xs" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm text-gray-800 text-sm max-w-[75%]">
                      Hey 👋 Welcome to <strong>PROPOYE</strong>!
                      <div className="text-[10px] text-gray-300 text-right mt-1">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message 2 */}
              <AnimatePresence>
                {message2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-gray-900 text-xs" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm text-gray-800 text-sm max-w-[75%]">
                      How can we help you today? 🏡
                      <div className="text-[10px] text-gray-300 text-right mt-1">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick reply options */}
              <AnimatePresence>
                {showOptions && step === "welcome" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 pl-9"
                  >
                    {["🏠 Browse Properties", "💰 Pricing & Plans", "📞 Contact Sales"].map(
                      (label, i) => (
                        <motion.button
                          key={label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => handleOptionClick(label)}
                          className="text-left text-sm text-gray-700 bg-white hover:bg-amber-400 hover:text-gray-900 border border-gray-200 hover:border-amber-400 px-4 py-2.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                        >
                          {label}
                        </motion.button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User selected option bubble */}
              <AnimatePresence>
                {selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-gray-900 text-white rounded-2xl rounded-br-none px-4 py-3 text-sm shadow-sm max-w-[75%]">
                      {selectedOption}
                      <div className="text-[10px] text-gray-400 text-right mt-1">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone step */}
              <AnimatePresence>
                {step === "phone" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {/* Bot reply */}
                    <div className="flex items-end gap-2">
                      <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaWhatsapp className="text-gray-900 text-xs" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm text-gray-800 text-sm max-w-[75%]">
                        Please share your phone number and we'll connect with you on WhatsApp! 📲
                        <div className="text-[10px] text-gray-300 text-right mt-1">
                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>

                    {/* Phone input */}
                    <div className="pl-9">
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRedirect()}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition shadow-sm placeholder-gray-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Footer / CTA */}
            {step === "phone" && (
              <div className="bg-[#f0ece4] px-4 pb-4">
                <button
                  onClick={handleRedirect}
                  disabled={!phone}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] shadow-md"
                >
                  <FaWhatsapp className="text-base" />
                  Continue to WhatsApp
                </button>
              </div>
            )}

            {/* WhatsApp footer branding */}
            <div className="bg-[#f0ece4] pb-3 flex justify-center">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                Powered by <FaWhatsapp className="text-green-500" /> WhatsApp
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
