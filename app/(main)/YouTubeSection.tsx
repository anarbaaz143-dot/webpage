"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumbnail(url: string): string | null {
  try {
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
  } catch {
    return null;
  }
}

type VideoEntry = {
  rawUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
};

export default function YouTubeSection() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const results = await Promise.all([
          fetch("/api/settings?key=home_youtube_url_1").then((r) => r.json()),
          fetch("/api/settings?key=home_youtube_url_2").then((r) => r.json()),
          fetch("/api/settings?key=home_youtube_url_3").then((r) => r.json()),
        ]);

        const entries: VideoEntry[] = [];
        for (const data of results) {
          if (data.value) {
            const embedUrl = getYouTubeEmbedUrl(data.value);
            const thumbnailUrl = getYouTubeThumbnail(data.value);
            if (embedUrl && thumbnailUrl) {
              entries.push({ rawUrl: data.value, embedUrl, thumbnailUrl });
            }
          }
        }
        setVideos(entries);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading || videos.length === 0) return null;

  const prev = () => setActiveIndex((i) => (i === 0 ? videos.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i + 1) % videos.length);

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* ── Left: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/40 rounded-full px-4 py-1.5 text-amber-600 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Watch & Learn
            </div>

            <h2
              className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              India's Trusted{" "}
              <span className="relative inline-block">
                <span className="text-amber-500">Real Estate</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="5"
                  viewBox="0 0 200 5"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 2.5 Q50 0 100 2.5 Q150 5 200 2.5"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              Expert
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-md">
              Get expert insights on the Indian real estate market — from neighbourhood
              deep-dives and investment tips to project walkthroughs and market trends.
              Everything you need before making your next move.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "In-depth project walkthroughs",
                "Market trends & investment insights",
                "Expert tips for first-time buyers",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm text-gray-600 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <a
              href="https://www.youtube.com/@growwitharbaaz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Visit Our YouTube Channel
            </a>
          </motion.div>

          {/* ── Right: 3-card carousel ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Cards */}
            <div className="relative flex justify-center items-center h-80">
              {videos.map((video, index) => {
                const isActive = index === activeIndex;
                const isPrev =
                  index === (activeIndex - 1 + videos.length) % videos.length;
                const isNext = index === (activeIndex + 1) % videos.length;
                const isVisible = isActive || isPrev || isNext;

                return (
                  <div
                    key={index}
                    onClick={() => !isActive && setActiveIndex(index)}
                    className={`absolute transition-all duration-700 ease-in-out ${
                      isActive
                        ? "z-20 cursor-default"
                        : isVisible
                        ? "z-10 cursor-pointer"
                        : "z-0 pointer-events-none"
                    }`}
                    style={{
                      transform: `translateX(${
                        isActive ? 0 : isPrev ? -230 : isNext ? 230 : 0
                      }px) scale(${isActive ? 1 : isVisible ? 0.88 : 0.75})`,
                      opacity: isActive ? 1 : isVisible ? 0.45 : 0,
                    }}
                  >
                    <div
                      className={`w-72 rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
                        isActive
                          ? "border-amber-400/40 shadow-[0_0_40px_rgba(251,191,36,0.15)]"
                          : "border-gray-200"
                      }`}
                    >
                      {/* Active: live embed */}
                      {isActive ? (
                        <div className="aspect-video bg-gray-900">
                          <iframe
                            key={video.embedUrl}
                            src={video.embedUrl}
                            title={`Propoye YouTube Video ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        /* Inactive: thumbnail with play button */
                        <div className="aspect-video bg-gray-900 relative overflow-hidden">
                          <img
                            src={video.thumbnailUrl}
                            alt={`Video ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                              <svg
                                className="w-5 h-5 text-white ml-0.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card footer */}
                      <div className="bg-gray-950 px-4 py-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-red-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span className="text-xs text-gray-400 font-medium">
                          Propoye Realty — Video {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            {videos.length > 1 && (
              <div className="flex justify-center items-center gap-5 mt-8">
                <button
                  onClick={prev}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-amber-400 hover:text-gray-900 text-gray-600 transition-all duration-300 rounded-full text-xl font-bold border border-gray-200"
                >
                  ‹
                </button>
                <div className="flex gap-2">
                  {videos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`transition-all duration-500 rounded-full ${
                        activeIndex === index
                          ? "w-6 h-2.5 bg-amber-400"
                          : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-amber-400 hover:text-gray-900 text-gray-600 transition-all duration-300 rounded-full text-xl font-bold border border-gray-200"
                >
                  ›
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}