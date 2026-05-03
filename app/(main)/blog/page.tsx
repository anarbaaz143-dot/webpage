"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const CATEGORIES = ["All", "Tips", "Buying Guides", "Legal & RERA", "Real Estate Fun 😄"];

type Post = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  instagramUrl: string;
  category: string;
  publishedAt: string;
  image: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); });
  }, []);

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero */}
      <section className="bg-gray-950 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-10 right-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1.5 text-pink-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <FaInstagram /> From Our Instagram
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Propoye <span className="text-amber-400">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            Tips, guides, and insights for home buyers and investors — straight from our Instagram.
          </motion.p>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-[7rem] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-amber-400 text-gray-900 shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FaInstagram className="text-5xl mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-lg">No posts in this category yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Instagram preview card */}
                  <div className="relative h-52 overflow-hidden">
  {post.image ? (
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
  ) : (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400">
      <FaInstagram className="text-white text-2xl" />
    </div>
  )}

  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
    {post.category}
  </div>
</div>

                  {/* Text */}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                    <h2
                      className="font-extrabold text-gray-900 text-base leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{post.summary}</p>
                    <div className="mt-4 flex items-center gap-1 text-amber-500 text-xs font-bold">
                      Read more
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      {/* ─── CTA ─── */}
<section className="py-24 text-center bg-white relative overflow-hidden">
  <div className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
      backgroundSize: "28px 28px",
    }}
  />
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative z-10 max-w-2xl mx-auto px-6"
  >
    <h2
      className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Ready to Find Your{" "}
      <span className="text-amber-500">Dream Property?</span>
    </h2>
    <p className="text-gray-500 mb-10 text-base">
      Let us help you discover the perfect place today.
    </p>
    <a
      href="/"
      className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white font-bold px-9 py-4 rounded-2xl text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.35)] shadow-lg"
    >
      Explore Properties
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  </motion.div>
</section>

    </div>
    

  );
}