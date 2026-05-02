"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LocalityData = {
  name: string;
  trending: boolean;
  icon: string;
  emoji: string;
  count: number;
  avgPrice: string | null;
};

const LOCALITIES = [
  { name: "Taloja",         trending: true,  icon: "🏙️", emoji: "🔥" },
  { name: "Kharghar",       trending: true,  icon: "🌆", emoji: "🔥" },
  { name: "Panvel",         trending: false, icon: "🏘️", emoji: "📍" },
  { name: "Nerul",          trending: false, icon: "🌊", emoji: "📍" },
  { name: "Upper Kharghar", trending: false, icon: "⛰️", emoji: "📍" },
  { name: "Seawoods",       trending: false, icon: "🌴", emoji: "📍" },
];

function parsePriceCr(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, "").replace(/₹/g, "").trim();
  const crMatch = cleaned.match(/([\d.]+)\s*Cr/i);
  if (crMatch) return parseFloat(crMatch[1]);
  const lMatch = cleaned.match(/([\d.]+)\s*L/i);
  if (lMatch) return parseFloat(lMatch[1]) / 100;
  return null;
}

function formatAvgPrice(cr: number): string {
  if (cr < 1) return `₹${Math.round(cr * 100)}L avg`;
  return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr avg`;
}

function formatCount(n: number): string {
  if (n === 0) return "0";
  if (n >= 50) return "50+";
  if (n >= 30) return "30+";
  if (n >= 20) return "20+";
  if (n >= 10) return "10+";
  return `${n}`;
}

export default function ExploreLocalities() {
  const router = useRouter();
  const [localities, setLocalities] = useState<LocalityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/property");
        const data: any[] = await res.json();

        const result: LocalityData[] = LOCALITIES.map((loc) => {
          const matched = (data || []).filter((p) =>
            p.location?.toLowerCase().includes(loc.name.toLowerCase())
          );

          const prices = matched
            .map((p) => parsePriceCr(p.pricingStartsFrom))
            .filter((n): n is number => n !== null);

          const avg =
            prices.length > 0
              ? prices.reduce((a, b) => a + b, 0) / prices.length
              : null;

          return {
            ...loc,
            count: matched.length,
            avgPrice: avg !== null ? formatAvgPrice(avg) : null,
          };
        });

        setLocalities(result);
      } catch {
        // show cards with 0 count on error
        setLocalities(
          LOCALITIES.map((loc) => ({ ...loc, count: 0, avgPrice: null }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null;

  const trending = localities.filter((l) => l.trending);
  const regular  = localities.filter((l) => !l.trending);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-5 py-1.5 text-amber-600 text-xs font-bold tracking-widest uppercase mb-4">
            📍 Explore by Area
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore <span className="text-amber-400">Localities</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Browse properties across top areas in Navi Mumbai
          </p>
        </div>

        {/* Trending row — 2 wide cards */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
          Trending Localities
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {trending.map((loc) => (
            <TrendingCard key={loc.name} loc={loc} router={router} />
          ))}
        </div>

        {/* Regular row — 4 smaller cards */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
          More Localities
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regular.map((loc) => (
            <RegularCard key={loc.name} loc={loc} router={router} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Trending Card (larger, rich) ──────────────────────────────────────────────

function TrendingCard({ loc, router }: { loc: LocalityData; router: any }) {
  const hasProps = loc.count > 0;

  return (
    <div
      onClick={() => hasProps && router.push(`/locality/${loc.name.toLowerCase().replace(/\s+/g, "-")}`)}
      className={`relative group rounded-2xl border p-6 transition-all duration-300 overflow-hidden
        ${hasProps
          ? "bg-white border-gray-100 cursor-pointer hover:border-amber-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(251,191,36,0.13)]"
          : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
        }`}
    >
      {/* Subtle background glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-500" />

      {/* Trending badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-[10px] px-3 py-1 rounded-full font-bold tracking-wide flex items-center gap-1 shadow-sm">
        🔥 Trending
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl shadow-sm">
          {loc.icon}
        </div>
        <div>
          <h3 className="font-extrabold text-gray-900 text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {loc.name}
          </h3>
          <p className="text-xs text-gray-400">Navi Mumbai</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {hasProps ? (
          <>
            <div>
              <div className="text-2xl font-extrabold text-amber-500">{formatCount(loc.count)}</div>
              <div className="text-[10px] text-gray-400 font-medium">Properties</div>
            </div>
            {loc.avgPrice && (
              <>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                  <div className="text-sm font-bold text-gray-700">{loc.avgPrice}</div>
                  <div className="text-[10px] text-gray-400 font-medium">Avg. Price</div>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-400 italic">No properties listed yet</p>
        )}
      </div>

      {/* Arrow */}
      {hasProps && (
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 text-sm font-bold shadow-md">
            →
          </div>
        </div>
      )}
    </div>
  );
}

// ── Regular Card (compact) ────────────────────────────────────────────────────

function RegularCard({ loc, router }: { loc: LocalityData; router: any }) {
  const hasProps = loc.count > 0;

  return (
    <div
      onClick={() => hasProps && router.push(`/locality/${loc.name.toLowerCase().replace(/\s+/g, "-")}`)}
      className={`relative group rounded-2xl border p-5 transition-all duration-300
        ${hasProps
          ? "bg-white border-gray-100 cursor-pointer hover:border-amber-300 hover:bg-amber-50/20 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(251,191,36,0.1)]"
          : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
        }`}
    >
      <div className="text-xl mb-3">{loc.icon}</div>
      <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{loc.name}</h3>

      {hasProps ? (
        <>
          <p className="text-xs text-gray-500">
            <span className="text-amber-500 font-extrabold text-base">{formatCount(loc.count)}</span>
            {" "}properties
          </p>
          {loc.avgPrice && (
            <p className="text-[10px] text-gray-400 mt-0.5">{loc.avgPrice}</p>
          )}
        </>
      ) : (
        <p className="text-[10px] text-gray-400 italic mt-1">Coming soon</p>
      )}

      {hasProps && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 text-xs font-bold">
            →
          </div>
        </div>
      )}
    </div>
  );
}