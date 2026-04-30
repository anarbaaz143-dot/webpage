"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

type Post = {
  id: number;
  title: string;
  summary: string;
  content: string;
  instagramUrl: string;
  category: string;
  publishedAt: string;
  image: string;
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog?id=${id}`)
      .then((r) => r.json())
      .then((data) => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!post) return;
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    };
    return () => {
      document.body.removeChild(script);
    };
  }, [post]);

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 border-r-pink-500 animate-spin" />
        </div>
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase font-light">Loading</p>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-6">
      <p className="text-6xl">📭</p>
      <p className="text-white/40 font-light tracking-widest uppercase text-sm">Post not found</p>
      <Link href="/blog" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors text-sm tracking-wide">
        ← Back to Blog
      </Link>
    </div>
  );

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .blog-detail-root {
          font-family: 'DM Sans', sans-serif;
          background: #0d0d0d;
          color: #e8e0d8;
          min-height: 100vh;
        }

        .display-font {
          font-family: 'Cormorant Garamond', serif;
        }

        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .hero-mesh {
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(236, 72, 153, 0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 60% 80%, rgba(251, 146, 60, 0.25) 0%, transparent 60%),
            #0d0d0d;
        }

        .ig-card {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }

        .ig-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, rgba(236,72,153,0.4), rgba(168,85,247,0.2), rgba(251,146,60,0.4));
          border-radius: 24px;
          z-index: -1;
        }

        .summary-block {
          background: linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(236,72,153,0.05) 100%);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .summary-block::before {
          content: '"';
          font-family: 'Cormorant Garamond', serif;
          font-size: 180px;
          color: rgba(251,191,36,0.06);
          position: absolute;
          top: -30px;
          left: 10px;
          line-height: 1;
          pointer-events: none;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          transition: color 0.2s;
          text-decoration: none;
        }
        .back-link:hover { color: #fbbf24; }
        .back-link svg { transition: transform 0.2s; }
        .back-link:hover svg { transform: translateX(-3px); }

        .content-prose {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          line-height: 1.85;
          color: rgba(232,224,216,0.8);
          font-weight: 300;
          white-space: pre-wrap;
        }

        .content-prose p {
          margin-bottom: 1.4em;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 6px 16px;
          color: rgba(255,255,255,0.8);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 48px 0;
        }
        .divider-ornament::before,
        .divider-ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1));
        }
        .divider-ornament::after {
          background: linear-gradient(to left, transparent, rgba(255,255,255,0.1));
        }

        /* Cover image shine effect */
        .cover-image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }
        .cover-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(15,15,15,0.6) 100%
          );
          pointer-events: none;
        }
      `}</style>

      <div className="blog-detail-root">

        {/* ── HERO ── */}
        <div className="hero-mesh noise relative overflow-hidden" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />

          {/* Top nav strip */}
          <div className="relative z-10 flex justify-between items-center px-8 pt-8 pb-0" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
            <Link href="/blog" className="back-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              All Posts
            </Link>
            <span className="text-white/20 text-xs tracking-widest uppercase font-light">Propoye Realty</span>
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-16 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6">
                <span className="category-pill">
                  <FaInstagram />
                  {post.category}
                </span>
              </div>

              <h1 className="display-font text-white leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 600, letterSpacing: "-0.01em" }}>
                {post.title}
              </h1>

              <div className="flex items-center gap-6 mt-8">
                <div className="w-8 h-px bg-amber-400/60" />
                <span className="text-white/40 text-xs tracking-[0.18em] uppercase font-light">{formattedDate}</span>
                <div className="w-8 h-px bg-amber-400/60" />
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          >
            <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>

        {/* ── CONTENT BODY ── */}
        <div className="relative" style={{ background: "#0f0f0f" }}>

          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />

          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* ── COVER IMAGE — inside the motion container, above summary ── */}
              {post.image && (
                <motion.div
                  className="cover-image-wrap mb-10 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover"
                    style={{ maxHeight: 420 }}
                  />
                </motion.div>
              )}

              {/* Summary callout */}
              <div className="summary-block px-8 py-7 mb-14">
                <p className="display-font text-amber-200/90 text-xl md:text-2xl font-light italic leading-relaxed relative z-10">
                  {post.summary}
                </p>
              </div>

              {/* Main content */}
              <div className="content-prose mb-16">
                {post.content}
              </div>

              {/* Ornament divider */}
              <div className="divider-ornament">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(251,191,36,0.4)" }} />
              </div>

              {/* ── INSTAGRAM EMBED ── */}
              <div className="ig-card p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7, #f97316)" }}>
                      <FaInstagram className="text-white" style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm tracking-wide">Featured on Instagram</p>
                      <p className="text-white/30 text-xs mt-0.5 tracking-wider">@propoye_realty</p>
                    </div>
                  </div>
                  <a
                    href={post.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                  >
                    Open ↗
                  </a>
                </div>

                <div className="flex justify-center">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={post.instagramUrl}
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: "0",
                      borderRadius: "12px",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5)",
                      margin: "0",
                      maxWidth: "540px",
                      minWidth: "326px",
                      padding: "0",
                      width: "100%",
                    }}
                  >
                    <div style={{ padding: "16px" }}>
                      <a
                        href={post.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e1306c", fontWeight: 700, fontSize: 14 }}
                      >
                        <FaInstagram /> View this post on Instagram
                      </a>
                    </div>
                  </blockquote>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 flex items-center justify-between">
                <Link href="/blog" className="back-link">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  All Articles
                </Link>
                <span className="text-white/15 text-xs tracking-widest uppercase">Propoye © {new Date().getFullYear()}</span>
              </div>

            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
}