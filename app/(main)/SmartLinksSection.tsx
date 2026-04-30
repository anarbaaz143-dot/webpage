"use client";

import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

// Each item: label shown + the locality keyword sent to search
const PEOPLE_ALSO_SEARCH: { label: string; locality: string }[] = [
  { label: "Property for Sale in Taloja, Navi Mumbai",      locality: "Taloja" },
  { label: "Property for Sale in Kharghar, Navi Mumbai",    locality: "Kharghar" },
  { label: "Flat for Sale in Upper Kharghar, Navi Mumbai",  locality: "Upper Kharghar" },
  { label: "Property for Sale in Panvel, Navi Mumbai",      locality: "Panvel" },
  { label: "Property for Sale in Seawoods, Navi Mumbai",    locality: "Seawoods" },
  { label: "New Residential Projects in Nerul",             locality: "Nerul" },
  { label: "Property for Sale in Thane",                    locality: "Thane" },
  { label: "Ready To Move Flats in Taloja",                 locality: "Taloja" },
  { label: "Luxury Flats in Kharghar",                      locality: "Kharghar" },
  { label: "Affordable Homes in Dronagiri",                 locality: "Dronagiri" },
];

// Each item: label shown + locality + bhk number (activates chip on search page)
const BHK_BY_LOCALITY: { label: string; locality: string; bhk: string }[] = [
  { label: "1 BHK Flats for Sale in Taloja",    locality: "Taloja",    bhk: "1" },
  { label: "2 BHK Flats for Sale in Taloja",    locality: "Taloja",    bhk: "2" },
  { label: "3 BHK Flats for Sale in Kharghar",  locality: "Kharghar",  bhk: "3" },
  { label: "1 BHK Flats for Sale in Panvel",    locality: "Panvel",    bhk: "1" },
  { label: "2 BHK Flats for Sale in Nerul",     locality: "Nerul",     bhk: "2" },
  { label: "3 BHK Flats for Sale in Seawoods",  locality: "Seawoods",  bhk: "3" },
  { label: "2 BHK Flats for Sale in Kharghar",  locality: "Kharghar",  bhk: "2" },
  { label: "3 BHK Flats for Sale in Panvel",    locality: "Panvel",    bhk: "3" },
  { label: "1 BHK Flats for Sale in Thane",     locality: "Thane",     bhk: "1" },
  { label: "2 BHK Flats for Sale in Thane",     locality: "Thane",     bhk: "2" },
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function localityHref(locality: string) {
  return `/search?q=${encodeURIComponent(locality)}`;
}

function bhkLocalityHref(locality: string, bhk: string) {
  return `/search?q=${encodeURIComponent(locality)}&bhk=${bhk}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SmartLinksSection() {
  return (
    <section className="py-16 bg-[#f5f5f0] border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        <h2
          className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Search Home Smarter With{" "}
          <span className="text-amber-500">Top Links</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

          {/* Column 1 */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
              People Also Search For
            </h3>
            <ul className="space-y-2.5">
              {PEOPLE_ALSO_SEARCH.map((item) => (
                <li key={item.label}>
                  <Link
                    href={localityHref(item.locality)}
                    className="text-sm text-gray-600 hover:text-amber-600 hover:underline transition-colors duration-150 leading-snug block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
              Search Flats in Navi Mumbai by BHK
            </h3>
            <ul className="space-y-2.5">
              {BHK_BY_LOCALITY.map((item) => (
                <li key={item.label}>
                  <Link
                    href={bhkLocalityHref(item.locality, item.bhk)}
                    className="text-sm text-gray-600 hover:text-amber-600 hover:underline transition-colors duration-150 leading-snug block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 tracking-wide uppercase">
              Popular Localities in Navi Mumbai
            </h3>
            <ul className="space-y-2.5">
              {POPULAR_LOCALITIES.map((loc) => (
                <li key={loc}>
                  <Link
                    href={localityHref(loc)}
                    className="text-sm text-gray-600 hover:text-amber-600 hover:underline transition-colors duration-150 leading-snug block"
                  >
                    Properties in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-gray-200" />
      </div>
    </section>
  );
}