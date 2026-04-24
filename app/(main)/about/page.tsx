"use client";

import { motion } from "framer-motion";
import { FaBuilding, FaHandshake, FaChartLine } from "react-icons/fa";
import BuildersSection from "../components/BuildersSection";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-950">

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-5 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Our Story
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About{" "}
            <span className="text-amber-400">PROPOYE</span>
          </h1>

          <p className="max-w-xl mx-auto text-base text-gray-400 leading-relaxed">
            Redefining the way people discover and invest in real estate.
          </p>
        </motion.div>
      </section>

      {/* ─── WHO WE ARE ───────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              className="rounded-3xl shadow-2xl w-full object-cover h-[420px]"
              alt="Who we are"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-amber-400 text-gray-900 rounded-2xl px-6 py-4 shadow-xl font-bold text-sm">
              <div className="text-2xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>10+</div>
              <div className="text-xs tracking-wide">Cities Covered</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-gray-500 text-xs font-bold tracking-widest uppercase mb-5">
              Who We Are
            </div>

            <h2
              className="text-4xl font-extrabold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Platform Built on{" "}
              <span className="text-amber-500">Trust</span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-5">
              PROPOYE is a modern real estate platform built to connect buyers,
              sellers, and investors with premium properties across top locations.
              We combine technology, trust, and transparency to make your
              property journey seamless.
            </p>

            <p className="text-gray-500 text-base leading-relaxed">
              Whether you're looking for your dream home or the next smart
              investment, we provide curated listings and market insights
              tailored to your needs.
            </p>

            {/* Mini stats row */}
            <div className="mt-10 flex gap-8">
              {[
                { value: "100+", label: "Listings" },
                { value: "98%", label: "Satisfaction" },
                { value: "₹100Cr+", label: "Deals Closed" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-xl font-extrabold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-400 tracking-wide uppercase mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── CORE VALUES ──────────────────────────────────────── */}
      <section className="py-28 bg-gray-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-8 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-500 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
              What Drives Us
            </div>
            <h2
              className="text-4xl font-extrabold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBuilding />,
                title: "Premium Listings",
                desc: "Handpicked properties in high-demand locations.",
                accent: "from-amber-400 to-orange-400",
              },
              {
                icon: <FaHandshake />,
                title: "Trust & Transparency",
                desc: "Clear communication and verified properties.",
                accent: "from-gray-700 to-gray-900",
              },
              {
                icon: <FaChartLine />,
                title: "Smart Investment",
                desc: "Data-driven insights for better decisions.",
                accent: "from-amber-400 to-amber-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 group text-left"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} text-white text-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION ──────────────────────────────────────────── */}
      <section className="py-32 bg-gray-950 relative overflow-hidden text-white text-center">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-6"
        >
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-5 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
            Our Mission
          </div>

          <blockquote
            className="text-3xl md:text-4xl font-extrabold leading-tight mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "To simplify real estate through{" "}
            <span className="text-amber-400">innovation</span>,{" "}
            <span className="text-amber-400">transparency</span>, and{" "}
            <span className="text-amber-400">exceptional service</span>."
          </blockquote>

          <p className="text-gray-400 text-base leading-relaxed">
            Helping every client find not just a property, but a place to belong.
          </p>
        </motion.div>
      </section>

      <BuildersSection />

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-28 text-center bg-white relative overflow-hidden">
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
