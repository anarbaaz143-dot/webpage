"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Builder = {
  id: number;
  name: string;
  description: string;
  image: string;
  established?: string;
  projectsCount?: string;
};

const MAX_GRID = 4;

export default function BuildersSection() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [stripOpen, setStripOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch("/api/builders")
      .then((r) => r.json())
      .then((data) => setBuilders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || builders.length === 0) return null;

  const visible = builders.slice(0, MAX_GRID);
  const extras = builders.slice(MAX_GRID);

  const handleChipClick = (builder: Builder) => {
    setStripOpen(true);
    setHighlightId(builder.id);
    setTimeout(() => {
      cardRefs.current[builder.id]?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }, 80);
  };

  const handleShowAll = () => {
    setStripOpen(true);
    setHighlightId(null);
  };

  const handleCollapse = () => {
    setStripOpen(false);
    setHighlightId(null);
  };

  return (
    <section className="py-28 bg-gray-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-500 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            Trusted Partners
          </div>
          <h2
            className="text-4xl font-extrabold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our <span className="text-amber-500">Builder</span> Network
          </h2>
          <p className="text-gray-400 mt-3 text-base max-w-xl mx-auto">
            We work with India's most trusted developers to bring you verified,
            premium properties.
          </p>
        </motion.div>

        {/* ── Main grid: first MAX_GRID builders ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.map((b, index) => (
            <BuilderCard
              key={b.id}
              builder={b}
              index={index}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>

        {/* ── Overflow chips ── */}
        {extras.length > 0 && !stripOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {/* Master "+N" chip */}
            <button
              onClick={handleShowAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:border-amber-300"
            >
              <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-600 text-xs font-bold flex items-center justify-center">
                +{extras.length}
              </span>
              {extras.length} more builder{extras.length > 1 ? "s" : ""}
            </button>

            {/* Individual chips */}
            {extras.map((b) => (
              <button
                key={b.id}
                onClick={() => handleChipClick(b)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all duration-200 shadow-sm hover:border-amber-300"
              >
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">🏢</span>
                )}
                {b.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Expanded scrollable strip ── */}
        {extras.length > 0 && stripOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <div
              className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {extras.map((b) => (
                <div
                  key={b.id}
                  ref={(el) => { cardRefs.current[b.id] = el; }}
                  style={{ scrollSnapAlign: "start", minWidth: "220px", maxWidth: "220px" }}
                >
                  <BuilderCard
                    builder={b}
                    index={0}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    highlighted={highlightId === b.id}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400 tracking-wide">
                ← Scroll to explore all builders
              </p>
              <button
                onClick={handleCollapse}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
              >
                Hide extra builders ↑
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

/* ─── Builder Card ──────────────────────────────────────────────────── */
function BuilderCard({
  builder: b,
  index,
  expanded,
  setExpanded,
  highlighted = false,
}: {
  builder: Builder;
  index: number;
  expanded: number | null;
  setExpanded: (id: number | null) => void;
  highlighted?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className={`bg-white border rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full ${
        highlighted
          ? "border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]"
          : "border-gray-100 hover:border-amber-200"
      }`}
    >
      {/* Image */}
      <div className="bg-gray-100 overflow-hidden relative flex items-center justify-center p-4">
        {b.image ? (
          <img
            src={b.image}
            alt={b.name}
            className="w-full h-auto object-contain max-h-36 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-5xl py-8">🏢</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-extrabold text-gray-900 text-base mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {b.name}
        </h3>

        {/* Stats pills */}
        <div className="flex gap-2 flex-wrap mb-3">
          {b.established && (
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-semibold">
              Est. {b.established}
            </span>
          )}
          {b.projectsCount && (
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 px-2.5 py-1 rounded-full font-semibold">
              {b.projectsCount} Projects
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className={`text-gray-500 text-xs leading-relaxed flex-1 transition-all duration-300 ${
            expanded === b.id ? "" : "line-clamp-3"
          }`}
        >
          {b.description}
        </p>

        {b.description.length > 120 && (
          <button
            onClick={() => setExpanded(expanded === b.id ? null : b.id)}
            className="text-amber-500 text-xs font-semibold mt-1.5 hover:text-amber-600 transition-colors self-start"
          >
            {expanded === b.id ? "Show less ↑" : "Read more ↓"}
          </button>
        )}

        {/* Bottom accent line */}
        <div
          className="mt-4 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
          style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}
        />
      </div>
    </motion.div>
  );
}