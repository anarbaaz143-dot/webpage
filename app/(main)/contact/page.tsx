"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let newErrors: any = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (phone && phone.length < 10)
      newErrors.phone = "Enter valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setSuccess(true);

    setTimeout(() => {
      const companyNumber = "919702162636";

      const message = encodeURIComponent(
        `Hi, my name is ${name}. My phone number is ${phone}. I'm interested in knowing more about your properties.`
      );

      window.open(
        `https://wa.me/${companyNumber}?text=${message}`,
        "_blank"
      );

      setName("");
      setPhone("");
      setSuccess(false);
    }, 1500);
  };

  return (
    <div className="bg-white text-gray-900 overflow-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[62vh] flex items-center justify-center bg-gray-950 text-white text-center px-6 overflow-hidden">

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-10 left-1/3 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slow rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] rounded-full border border-amber-400/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none"
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-5 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            We're Here to Help
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact{" "}
            <span className="text-amber-400">Us</span>
          </h1>

          <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed">
            Let's help you find your perfect property.
          </p>
        </motion.div>
      </section>

      {/* ─── CONTACT SECTION ──────────────────────────────────── */}
      <section className="py-28 bg-gray-50 relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-start">

          {/* ── LEFT INFO ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-500 text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
                Reach Out
              </div>
              <h2
                className="text-4xl font-extrabold mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Get In{" "}
                <span className="text-amber-500">Touch</span>
              </h2>
              <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                Whether you're buying, investing, or just exploring —
                our team is ready to guide you every step of the way.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="space-y-4">
              {[
                {
                  icon: <FaPhoneAlt />,
                  label: "Phone",
                  value: "+91 97021 62636",
                  accent: "bg-amber-400",
                },
                {
                  icon: <FaEnvelope />,
                  label: "Email",
                  value: "Admin@propoye.com",
                  accent: "bg-gray-900",
                },
                {
                  icon: <FaMapMarkerAlt />,
                  label: "Location",
                  value: "Mumbai, India",
                  accent: "bg-amber-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
                >
                  <div
                    className={`w-11 h-11 flex items-center justify-center ${item.accent} text-white rounded-xl text-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 tracking-widest uppercase font-semibold mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-gray-800 font-medium text-sm">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp quick link */}
            <a
              href="https://wa.me/919702162636"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] shadow-lg text-sm"
            >
              <FaWhatsapp className="text-lg" />
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* ── RIGHT FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />

            <div className="mb-8">
              <h3
                className="text-2xl font-extrabold text-gray-900 mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Request a Callback
              </h3>
              <p className="text-sm text-gray-400">
                Fill in your details and we'll reach out via WhatsApp.
              </p>
            </div>

            <div className="space-y-6">

              {/* NAME FIELD */}
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  className={`peer w-full px-4 pt-6 pb-3 border rounded-2xl outline-none focus:ring-2 bg-gray-50 focus:bg-white transition-all ${
                    errors.name
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-200 focus:ring-amber-400 focus:border-amber-400"
                  }`}
                />
                <label className="absolute left-4 top-3 text-gray-400 text-xs font-semibold tracking-wide uppercase transition-all peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-amber-500">
                  Your Name
                </label>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.name}
                  </p>
                )}
              </div>

              {/* PHONE FIELD */}
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=" "
                  className={`peer w-full px-4 pt-6 pb-3 border rounded-2xl outline-none focus:ring-2 bg-gray-50 focus:bg-white transition-all ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-200 focus:ring-amber-400 focus:border-amber-400"
                  }`}
                />
                <label className="absolute left-4 top-3 text-gray-400 text-xs font-semibold tracking-wide uppercase transition-all peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-amber-500">
                  Phone Number
                </label>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.phone}
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="w-full py-4 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] shadow-md flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                <FaWhatsapp className="text-lg" />
                Send via WhatsApp
              </motion.button>

              {/* SUCCESS */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm font-medium py-3 rounded-2xl"
                  >
                    <span className="text-base">✓</span>
                    Redirecting to WhatsApp…
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
