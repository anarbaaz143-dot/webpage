"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";
import LeadBot from "@/app/(main)/components/LeadBot";


const navLinks = ["About", "News", "Blog"];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_30px_rgba(0,0,0,0.08)] border-b border-gray-100"
            : "bg-white/80 backdrop-blur-md border-b border-gray-100/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-20 md:h-28 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer flex-shrink-0">
            <img
              src="/nobglogo.png"
              alt="PROPOYE Logo"
              className="h-20 md:h-30 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav — replace your existing <nav className="hidden md:flex ..."> with this */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/#search"
              className="px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Search
            </Link>
 
            {navLinks.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                {item}
              </Link>
            ))}
 
            {/* Loan Calculator button */}
            <Link
              href="/loan-calculator"
              className="ml-2 px-6 py-3 text-base font-medium text-amber-600 hover:text-gray-900 hover:bg-amber-50 border border-amber-200 hover:border-amber-400 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              EMI Calc
            </Link>
 
            <Link
              href="/contact"
              className="ml-2 px-7 py-3.5 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white text-base font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <span
              className={`block h-0.5 bg-gray-800 rounded-full transition-all duration-300 origin-center ${
                menuOpen ? "w-5 rotate-45 translate-y-2" : "w-6"
              }`}
            />
            <span
              className={`block h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                menuOpen ? "w-0 opacity-0" : "w-5"
              }`}
            />
            <span
              className={`block h-0.5 bg-gray-800 rounded-full transition-all duration-300 origin-center ${
                menuOpen ? "w-5 -rotate-45 -translate-y-2" : "w-6"
              }`}
            />
          </button>
        </div>
      </header>

      {/* ─── MOBILE SLIDE-IN DRAWER ─────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[75vw] max-w-xs bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <img src="/nobglogo.png" alt="PROPOYE" className="h-10 w-auto object-contain" />
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
              aria-label="Close"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-4 py-6 gap-1 flex-grow">
            <Link
              href="/#search"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-base"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>

                      <Link
            href="/loan-calculator"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-base"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            EMI Calculator
          </Link>

            {navLinks.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-base"
              >
                <span className="text-gray-300 text-xs">→</span>
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA + socials at bottom */}
          <div className="px-4 pb-8">
            <Link
              href="/contact"
              className="block w-full text-center py-4 bg-gray-900 hover:bg-amber-400 hover:text-gray-900 text-white font-bold rounded-2xl transition-all duration-300 text-base"
            >
              Contact Us
            </Link>

            <div className="flex justify-center gap-3 mt-5">
              <a href="https://wa.me/919702162636" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-green-500 hover:text-white rounded-xl transition-all duration-200 text-gray-500">
                <FaWhatsapp className="text-sm" />
              </a>
              <a href="https://www.instagram.com/propoye_realty?igsh=MTB0ZWg2MGswYWphNw==" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-pink-500 hover:text-white rounded-xl transition-all duration-200 text-gray-500">
                <FaInstagram className="text-sm" />
              </a>
              <a href="https://www.facebook.com/share/1DqavThhhL/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 text-gray-500">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="https://www.linkedin.com/company/propoye-realty-llp/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-blue-700 hover:text-white rounded-xl transition-all duration-200 text-gray-500">
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow">{children}</main>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">

            <div className="text-center md:text-left">
              <img
                src="/nobglogo.png"
                alt="PROPOYE"
                className="h-12 w-auto object-contain mb-3 opacity-80 mx-auto md:mx-0 brightness-0 invert"
              />
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Disclaimer:

We are an authorized marketing partner Maharashtra RERA ID: A51800046254 for this project. 
Provided content is given by respective owners and this website and content is for information purpose only and it does not constitute any offer to avail for any services. 
Prices mentioned are subject to change without prior notice and properties mentioned are subject to availability. 
You can expect a call, SMS or emails on details registered with us.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {["About", "News", "Blog", "Contact", "Trending"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-500 hover:text-amber-400 transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex gap-3">
              <a href="https://wa.me/919702162636" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-green-600 hover:border-green-600 hover:text-white hover:scale-110 transition-all duration-300">
                <FaWhatsapp className="text-base" />
              </a>
              <a href="https://www.instagram.com/propoye_realty?igsh=MTB0ZWg2MGswYWphNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-500 hover:border-pink-500 hover:text-white hover:scale-110 transition-all duration-300">
                <FaInstagram className="text-base" />
              </a>
              <a href="https://www.facebook.com/share/1DqavThhhL/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:scale-110 transition-all duration-300">
                <FaFacebookF className="text-base" />
              </a>
              <a href="https://www.linkedin.com/company/propoye-realty-llp/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-700 hover:border-blue-700 hover:text-white hover:scale-110 transition-all duration-300">
                <FaLinkedinIn className="text-base" />
              </a>
            </div>
          </div>

          <div className="mt-10 md:mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600 text-center">
            <span>© 2026 PROPOYE.COM. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Made with <span className="text-amber-400 text-sm">♥</span> in India
            </span>
          </div>
        </div>
      </footer>

      <LeadBot />
    </div>
  );
}