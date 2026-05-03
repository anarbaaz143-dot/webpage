"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  sourceUrl?: string;
  sourceLabel?: string;
  publishedAt: string;
};

export default function NewsDetailPage() {
  const params = useParams();
const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { setArticle(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-400 rounded-full animate-spin" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">📭</p>
      <p className="text-gray-500 font-semibold">Article not found</p>
      <Link href="/news" className="text-amber-500 font-bold hover:underline">← Back to News</Link>
    </div>
  );

  return (
    <>
    <div className="min-h-screen bg-white font-sans">

      {/* Hero image */}
      <div className="relative h-[50vh] overflow-hidden bg-gray-900">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {article.title}
            </h1>
            <p className="text-gray-400 text-sm mt-3">
              {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-500 font-semibold mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>

          {/* Summary callout */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl px-6 py-4 mb-8">
            <p className="text-gray-700 text-base font-medium leading-relaxed italic">
              {article.summary}
            </p>
          </div>

          {/* Main content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>

          {/* External source button */}
          {article.sourceUrl && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-400 mb-3">Source</p>

              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {article.sourceLabel || "Read Full Article"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

            </div>
          )}

        </motion.div>
      </div>
    </div>

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
</>
  );
}
