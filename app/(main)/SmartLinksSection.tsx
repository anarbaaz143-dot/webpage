"use client";

import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const PEOPLE_ALSO_SEARCH = [
  "Property for Sale in Taloja, Navi Mumbai",
  "Property for Sale in Kharghar, Navi Mumbai",
  "Flat for Sale in Upper Kharghar, Navi Mumbai",
  "Property for Sale in Panvel, Navi Mumbai",
  "Property for Sale in Seawoods, Navi Mumbai",
  "New Residential Projects in Nerul",
  "Property for Sale in Thane",
  "Ready To Move Flats in Taloja",
  "Luxury Flats in Kharghar",
  "Affordable Homes in Dronagiri",
];

const BHK_BY_LOCALITY = [
  { label: "1 BHK Flats for Sale in Taloja", query: "1 BHK Taloja" },
  { label: "2 BHK Flats for Sale in Taloja", query: "2 BHK Taloja" },
  { label: "3 BHK Flats for Sale in Kharghar", query: "3 BHK Kharghar" },
  { label: "1 BHK Flats for Sale in Panvel", query: "1 BHK Panvel" },
  { label: "2 BHK Flats for Sale in Nerul", query: "2 BHK Nerul" },
  { label: "3 BHK Flats for Sale in Seawoods", query: "3 BHK Seawoods" },
  { label: "2 BHK Flats for Sale in Kharghar", query: "2 BHK Kharghar" },
  { label: "3 BHK Flats for Sale in Panvel", query: "3 BHK Panvel" },
  { label: "1 BHK Flats for Sale in Thane", query: "1 BHK Thane" },
  { label: "2 BHK Flats for Sale in Thane", query: "2 BHK Thane" },
];

const POPULAR_LOCALITIES = [
  "Kharghar",
  "Upper Kharghar",
  "Panvel",
  "Taloja",
  "Nerul",
  "Seawoods",
  "Sanpada",
  "Belapur",
  "Thane",
  "Dronagiri",
  "Ulwe",
  "Kamothe",
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function toSearchHref(query: string) {
  return `/search?q=${encodeURIComponent(query)}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SmartLinksSection() {
  return (
    <section className="py-16 bg-[#f5f5f0] border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Heading */}
        <h2
          className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Search Home Smarter With{" "}
          <span className="text-amber-500">Top Links</span>
        </h2>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

          {/* Column 1 — People Also Search For */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
              People Also Search For
            </h3>
            <ul className="space-y-2.5">
              {PEOPLE_ALSO_SEARCH.map((item) => (
                <li key={item}>
                  <Link
                    href={toSearchHref(item)}
                    className="text-sm text-gray-600 hover:text-amber-600 hover:underline transition-colors duration-150 leading-snug block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Search by BHK */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
              Search Flats in Navi Mumbai by BHK
            </h3>
            <ul className="space-y-2.5">
              {BHK_BY_LOCALITY.map((item) => (
                <li key={item.label}>
                  <Link
                    href={toSearchHref(item.query)}
                    className="text-sm text-gray-600 hover:text-amber-600 hover:underline transition-colors duration-150 leading-snug block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Popular Localities */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
              Popular Localities in Navi Mumbai
            </h3>
            <ul className="space-y-2.5">
              {POPULAR_LOCALITIES.map((loc) => (
                <li key={loc}>
                  <Link
                    href={toSearchHref(loc)}
                    className="text-sm text-gray-600 hover:text-amber-600 hover:underline transition-colors duration-150 leading-snug block"
                  >
                    Properties in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-gray-200" />
      </div>
    </section>
  );
}