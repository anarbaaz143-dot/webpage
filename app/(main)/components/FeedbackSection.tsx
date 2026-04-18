"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Feedback = {
  id: number;
  name: string;
  rating: number;
  description: string;
  slot: number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/feedback")
    .then((r) => r.json())
    .then((data) => setFeedbacks(Array.isArray(data) ? data : []))
    .catch(() => {})
    .finally(() => setLoading(false));
}, []);

  if (loading || feedbacks.length === 0) return null;

  return (
    <section className="py-28 bg-gray-950 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glows */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <span className="text-base">❤️</span> Happy Clients
          </div>
          <h2
            className="text-5xl font-extrabold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Our <span className="text-amber-400">Clients</span> Say
          </h2>
          <p className="text-gray-400 mt-4 text-base max-w-xl mx-auto leading-relaxed">
            Real stories from real buyers and investors who found their perfect
            property with Propoye.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {feedbacks.map((fb, index) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900 border border-white/8 rounded-3xl p-6 flex flex-col gap-4 hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)] transition-all duration-300 group"
            >
              {/* Quote mark */}
              <div className="text-amber-400/30 text-5xl font-serif leading-none select-none group-hover:text-amber-400/50 transition-colors duration-300">
                "
              </div>

              {/* Stars */}
              <StarRating rating={fb.rating} />

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed flex-1">
                {fb.description}
              </p>

              {/* Name */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-gray-900 font-extrabold text-sm flex-shrink-0">
                  {fb.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{fb.name}</p>
                  <p className="text-gray-500 text-xs">Verified Buyer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["A", "R", "S", "M", "P"].map((letter, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-gray-950 flex items-center justify-center text-[10px] font-bold text-gray-900"
                  style={{
                    background: `hsl(${i * 40 + 30}, 80%, 55%)`,
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm font-medium">
              <span className="text-amber-400 font-bold">500+</span> more happy
              customers just like you
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}