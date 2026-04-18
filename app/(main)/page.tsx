"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import YouTubeSection from "./YouTubeSection";
import FeedbackSection from "./components/FeedbackSection";

const taglines = [
  { top: "Your Next Address", bottom: "Begins at Propoye" },
  { top: "The Future of", bottom: "Home Search — 0% Brokerage" },
  { top: "From House Hunting", bottom: "to Home Living" },
  { top: "Where India Finds", bottom: "Its Next Home" },
  { top: "The Future of", bottom: "Home Search Starts Here" },
];

const QUICK_SUGGESTIONS = [
  { label: "1 BHK", icon: "🏠" },
  { label: "2 BHK", icon: "🏠" },
  { label: "3 BHK", icon: "🏠" },
  { label: "Ready to Move", icon: "✅" },
  { label: "Trending", icon: "🔥" },
];


export default function Home() {
  const router = useRouter();

  const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
  ];

  const [taglineIndex, setTaglineIndex] = useState(0);
  const [resultIndex, setResultIndex] = useState(0);
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [trendingHomes, setTrendingHomes] = useState<any[]>([]);
  const [trendingIndex, setTrendingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.length > 1) {
      const res = await fetch(`/api/property?search=${value}`);
      const data = await res.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  const goToSearchPage = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await fetch("/api/property");
      const data = await res.json();
      const trending = data.filter((p: any) => p.isTrending);
      setTrendingHomes(trending);
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (trendingHomes.length === 0) return;
    const interval = setInterval(() => {
      setTrendingIndex((prev) => (prev + 1) % trendingHomes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingHomes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[92vh] overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out ${
              index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`transition-all duration-500 rounded-full ${i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm tracking-widest uppercase text-amber-300 font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Premium Real Estate
          </motion.div>

          {/* ── Rotating tagline ── */}
          <div className="h-[168px] md:h-[190px] flex flex-col items-center justify-center overflow-hidden mb-3">
            <AnimatePresence mode="wait">
              <motion.h1
                key={taglineIndex}
                initial={{ opacity: 0, y: 45, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {taglines[taglineIndex].top}
                <br />
                <span className="relative inline-block text-amber-400">
                  {taglines[taglineIndex].bottom}
                  <motion.svg
                    key={taglineIndex + "-underline"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 300 5" fill="none" preserveAspectRatio="none"
                  >
                    <motion.path d="M0 2.5 Q75 0 150 2.5 Q225 5 300 2.5" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                  </motion.svg>
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Tagline indicator dots */}
          <div className="flex gap-2 mb-7">
            {taglines.map((_, i) => (
              <button
                key={i}
                onClick={() => setTaglineIndex(i)}
                className={`transition-all duration-500 rounded-full ${
                  i === taglineIndex ? "w-6 h-2 bg-amber-400" : "w-2 h-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-gray-300 max-w-xl leading-relaxed mb-10"
          >
            Discover premium properties in top locations, curated and tailored just for you.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] shadow-lg"
          >
            Explore Properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      </section>

      {/* ─── STATS STRIP ──────────────────────────────────────── */}
      <section className="bg-gray-950 text-white py-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 flex flex-wrap justify-center gap-10 md:gap-20 text-center">
          {[
            { value: "1,200+", label: "Properties Listed" },
            { value: "98%", label: "Happy Clients" },
            { value: "15+", label: "Cities Covered" },
            { value: "₹500Cr+", label: "Deals Closed" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-extrabold text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
              <div className="text-xs text-gray-400 tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

       {/* ─── SEARCH SECTION ───────────────────────────────────── */}
      <section id="search" className="py-28 bg-gradient-to-b from-stone-50 to-white flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          className="w-full max-w-4xl mx-4 bg-white border border-gray-100 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-12 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 rounded-full px-6 py-1.5 text-xs font-bold tracking-widest uppercase text-gray-900 shadow-md">
            Property Search
          </div>
 
          <h2 className="text-3xl font-extrabold text-center mb-3 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Find the Right Property
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">Search by city, locality, or project name</p>
 
          {/* Search input + button */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search city, locality or project name…"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goToSearchPage()}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              onClick={goToSearchPage}
              className="px-10 py-4 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md tracking-wide"
            >
              Search
            </button>
          </div>
 
          {/* Quick suggestion chips — shown when search box is empty */}
          {!searchTerm && (
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-3 font-medium">Quick searches</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setSearchTerm(s.label);
                      router.push(`/search?q=${encodeURIComponent(s.label)}`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200"
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
 
          {/* Inline results dropdown */}
          {results.length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-gray-400 font-medium mb-3 tracking-wide">
                {results.length} suggestion{results.length !== 1 ? "s" : ""} —{" "}
                <button onClick={goToSearchPage} className="text-amber-500 font-bold hover:underline">
                  View all results →
                </button>
              </p>
 
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${resultIndex * 100}%)`, width: `${Math.ceil(results.length / 5) * 100}%` }}
                >
                  {Array.from({ length: Math.ceil(results.length / 5) }).map((_, groupIndex) => (
                    <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full flex-shrink-0">
                      {results.slice(groupIndex * 5, groupIndex * 5 + 5).map((property) => (
                        <div
                          key={property.id}
                          onClick={() => (window.location.href = `/property/${property.id}`)}
                          className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <h3 className="font-semibold text-sm text-gray-800 group-hover:text-amber-600 transition-colors">
                              {property.projectName}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 pl-4">
                            {property.location}
                            {property.pricingStartsFrom && (
                              <span className="block text-amber-500 font-semibold mt-0.5">{property.pricingStartsFrom}</span>
                            )}
                            {property.configuration && (
                              <span className="block text-gray-400 mt-0.5">{property.configuration}</span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
 
              {results.length > 5 && (
                <div className="flex justify-between mt-6">
                  <button onClick={() => setResultIndex((prev) => prev === 0 ? Math.ceil(results.length / 5) - 1 : prev - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-amber-400 hover:text-white transition rounded-full text-lg font-bold shadow-sm">‹</button>
                  <button onClick={() => setResultIndex((prev) => (prev + 1) % Math.ceil(results.length / 5))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-amber-400 hover:text-white transition rounded-full text-lg font-bold shadow-sm">›</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </section>

      {/* ─── TRENDING SECTION ─────────────────────────────────── */}
      <section className="py-28 bg-gray-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="text-base">🔥</span> Hot Right Now
            </div>
            <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Trending<br /><span className="text-amber-400">Homes</span>
            </h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed max-w-sm">
              Explore the most popular and in-demand properties right now. These homes are trending among buyers and investors.
            </p>
            <Link href="/trending" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] shadow-lg">
              View All Properties
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          <div>
            <div className="relative flex justify-center items-center h-80">
              {trendingHomes.map((home, index) => {
                const isActive = index === trendingIndex;
                const isPrev = index === (trendingIndex - 1 + trendingHomes.length) % trendingHomes.length;
                const isNext = index === (trendingIndex + 1) % trendingHomes.length;
                return (
                  <div key={home.id} onClick={() => (window.location.href = `/property/${home.id}`)}
                    className={`absolute transition-all duration-700 ease-in-out cursor-pointer ${isActive ? "scale-100 opacity-100 z-20" : isPrev || isNext ? "scale-90 opacity-40 z-10" : "scale-75 opacity-0 z-0"}`}
                    style={{ transform: `translateX(${isActive ? 0 : isPrev ? -220 : isNext ? 220 : 0}px) scale(${isActive ? 1 : isPrev || isNext ? 0.9 : 0.75})` }}
                  >
                    <div className="w-72 bg-gray-900 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 shadow-2xl group">
                      <div className="relative overflow-hidden h-48">
                        <img src={home.images?.[0]} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={home.projectName} />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                        <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">Trending</div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-bold text-white mb-1">{home.projectName}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {home.location}
                        </div>
                        {home.pricingStartsFrom && <div className="mt-2 text-amber-400 text-xs font-semibold">{home.pricingStartsFrom}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-5 mt-8">
              <button onClick={() => setTrendingIndex((prev) => prev === 0 ? trendingHomes.length - 1 : prev - 1)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-400 hover:text-gray-900 text-white transition-all duration-300 rounded-full text-xl font-bold border border-white/10">‹</button>
              <div className="flex gap-2">
                {trendingHomes.map((_, index) => (
                  <button key={index} onClick={() => setTrendingIndex(index)}
                    className={`transition-all duration-500 rounded-full ${trendingIndex === index ? "w-6 h-2.5 bg-amber-400" : "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"}`}
                  />
                ))}
              </div>
              <button onClick={() => setTrendingIndex((prev) => (prev + 1) % trendingHomes.length)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-400 hover:text-gray-900 text-white transition-all duration-300 rounded-full text-xl font-bold border border-white/10">›</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── YOUTUBE SECTION ──────────────────────────────────── */}
      <YouTubeSection />
      <FeedbackSection />

    </div>
  );
}