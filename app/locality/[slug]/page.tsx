"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// ─── helpers (same as search page) ──────────────────────────────────────────

function parsePriceCr(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, "").replace(/₹/g, "").trim();
  const crMatch = cleaned.match(/([\d.]+)\s*Cr/i);
  if (crMatch) return parseFloat(crMatch[1]);
  const lMatch = cleaned.match(/([\d.]+)\s*L/i);
  if (lMatch) return parseFloat(lMatch[1]) / 100;
  return null;
}

function matchesBHK(config: string, bhk: string): boolean {
  if (bhk === "4+") return /[4-9]\s*BHK/i.test(config);
  return new RegExp(`${bhk}\\s*BHK`, "i").test(config);
}

function isReadyToMove(possessionDate: string, now: Date): boolean {
  const lower = possessionDate.toLowerCase();
  if (lower.includes("ready") || lower.includes("immediate")) return true;
  const parsed = new Date(possessionDate);
  if (!isNaN(parsed.getTime())) return parsed <= now;
  const match = possessionDate.match(/(\w+)\s+(\d{4})/);
  if (match) {
    const d = new Date(`${match[1]} 1, ${match[2]}`);
    return d <= now;
  }
  return false;
}

function formatPrice(raw: string): { primary: string; sub: string } {
  const cr = parsePriceCr(raw);
  if (cr === null) return { primary: raw, sub: "" };
  if (cr < 1) {
    const lakhs = Math.round(cr * 100);
    return { primary: `₹${lakhs}L`, sub: `₹${(lakhs * 100000).toLocaleString("en-IN")}` };
  }
  return { primary: `₹${cr} Cr`, sub: `₹${(cr * 10000000).toLocaleString("en-IN")}` };
}

// ─── slug ↔ display name mapping ─────────────────────────────────────────────

const SLUG_TO_NAME: Record<string, string> = {
  "taloja":         "Taloja",
  "kharghar":       "Kharghar",
  "panvel":         "Panvel",
  "nerul":          "Nerul",
  "upper-kharghar": "Upper Kharghar",
  "seawoods":       "Seawoods",
};

const LOCALITY_META: Record<string, { icon: string; trending: boolean; tagline: string }> = {
  "taloja":         { icon: "🏙️", trending: true,  tagline: "Fast-growing hub with excellent connectivity" },
  "kharghar":       { icon: "🌆", trending: true,  tagline: "Planned township with lush greens & modern living" },
  "panvel":         { icon: "🏘️", trending: false, tagline: "Well-connected node near the new international airport" },
  "nerul":          { icon: "🌊", trending: false, tagline: "Serene lakeside locality with great social infrastructure" },
  "upper-kharghar": { icon: "⛰️", trending: false, tagline: "Elevated township offering premium hilltop living" },
  "seawoods":       { icon: "🌴", trending: false, tagline: "Premium coastal living with excellent metro access" },
};

// ─── Chip ────────────────────────────────────────────────────────────────────

function Chip({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon?: string }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 flex items-center gap-1 ${
        active
          ? "bg-amber-400 text-gray-900 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.35)]"
          : "bg-white/5 text-gray-400 border-white/10 hover:border-amber-400/50 hover:text-amber-300"
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

function StatBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
      <span>{icon}</span>{label}
    </span>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCard({ property, now }: { property: any; now: Date }) {
  const ready = isReadyToMove(property.possessionDate || "", now);
  const { primary: priceMain, sub: priceSub } = formatPrice(property.pricingStartsFrom || "");
  const bhkList = (property.configuration || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  return (
    <Link
      href={`/property/${property.slug || property.id}`}
      className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-amber-200 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative overflow-hidden h-52 flex-shrink-0">
        <img
          src={property.images?.[0]}
          alt={property.projectName}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {property.isTrending && (
            <div className="inline-flex items-center gap-1 bg-amber-400 text-gray-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
              🔥 Trending
            </div>
          )}
          {property.isReadyToMove && (
            <div className="inline-flex items-center gap-1 bg-green-400 text-green-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
              ✓ Ready to Move
            </div>
          )}
          {property.isUnderConstruction && (
            <div className="inline-flex items-center gap-1 bg-orange-400 text-orange-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
              🏗 Under Construction
            </div>
          )}
          {property.isNewLaunch && (
            <div className="inline-flex items-center gap-1 bg-blue-400 text-blue-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
              🚀 New Launch
            </div>
          )}
          {property.isEarlypossesion && (
            <div className="inline-flex items-center gap-1 bg-purple-400 text-purple-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
              🌏 Early Possession
            </div>
          )}
        </div>

        {property.projectArea && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
            📐 {property.projectArea}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="text-white text-lg font-extrabold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {priceMain}
            </div>
            {priceSub && <div className="text-white/60 text-[9px]">onwards · {priceSub}</div>}
          </div>
          <div className="bg-black/50 backdrop-blur-md text-white/70 text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/20">
            {property.propoyeId}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-[15px] font-extrabold mb-0.5 text-gray-900 group-hover:text-amber-500 transition-colors leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {property.projectName}
        </h2>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="truncate">{property.location}</span>
        </div>

        {bhkList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bhkList.map((b: string) => (
              <span key={b} className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-2">
          {property.floors && <StatBadge icon="🏢" label={`${property.floors} Floors`} />}
          {property.towers && <StatBadge icon="🗼" label={`${property.towers} Towers`} />}
          {property.possessionDate && !ready && <StatBadge icon="📅" label={property.possessionDate} />}
        </div>

        {property.description && (
          <p className="text-[10px] text-gray-400 leading-relaxed mt-1 line-clamp-2 flex-1">
            {property.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            {property.floorPlans?.length > 0 ? `${property.floorPlans.length} floor plan${property.floorPlans.length > 1 ? "s" : ""}` : ""}
          </span>
          <span className="text-[11px] font-bold text-amber-500 group-hover:text-amber-600 transition-colors flex items-center gap-1">
            View Details <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── constants ────────────────────────────────────────────────────────────────

type SortKey = "relevance" | "price_asc" | "price_desc" | "newest";

const BHK_OPTIONS = ["1", "2", "3", "4+"];

const PRICE_OPTIONS: { label: string; min: number; max: number | null }[] = [
  { label: "Under ₹10L",     min: 0,    max: 0.1  },
  { label: "₹10L – ₹25L",   min: 0.1,  max: 0.25 },
  { label: "₹25L – ₹50L",   min: 0.25, max: 0.5  },
  { label: "₹50L – ₹75L",   min: 0.5,  max: 0.75 },
  { label: "₹75L – ₹1Cr",   min: 0.75, max: 1    },
  { label: "₹1Cr – ₹1.5Cr", min: 1,    max: 1.5  },
  { label: "₹1.5Cr – ₹2Cr", min: 1.5,  max: 2    },
  { label: "₹2Cr – ₹3Cr",   min: 2,    max: 3    },
  { label: "₹3Cr – ₹5Cr",   min: 3,    max: 5    },
  { label: "₹5Cr+",         min: 5,    max: null },
];

// ─── main page ────────────────────────────────────────────────────────────────

export default function LocalityPage() {
  const params  = useParams();
  const router  = useRouter();
  const now     = useMemo(() => new Date(), []);

  const slug        = (params?.slug as string) || "";
  const localityName = SLUG_TO_NAME[slug] || slug;
  const meta        = LOCALITY_META[slug] || { icon: "📍", trending: false, tagline: "Explore properties in this area" };

  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [notFound, setNotFound]           = useState(false);

  // filters
  const [activeBHK,            setActiveBHK]            = useState<string | null>(null);
  const [activePriceIdx,       setActivePriceIdx]       = useState<number | null>(null);
  const [onlyTrending,         setOnlyTrending]         = useState(false);
  const [onlyReady,            setOnlyReady]            = useState(false);
  const [onlyUnderConstruction,setOnlyUnderConstruction]= useState(false);
  const [onlyNewLaunch,        setOnlyNewLaunch]        = useState(false);
  const [onlyEarlypossesion,   setOnlyEarlypossesion]   = useState(false);
  const [sortKey,              setSortKey]              = useState<SortKey>("relevance");
  const [showAllPrices,        setShowAllPrices]        = useState(false);
  const [viewMode,             setViewMode]             = useState<"grid" | "list">("grid");

  // ── fetch all properties then filter by locality ──
  useEffect(() => {
    if (!slug || !SLUG_TO_NAME[slug]) { setNotFound(true); setLoading(false); return; }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res  = await fetch("/api/property");
        const data: any[] = await res.json();
        const filtered = data.filter((p) =>
          p.location?.toLowerCase().includes(localityName.toLowerCase())
        );
        setAllProperties(filtered);
      } catch {
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, localityName]);

  const clearFilters = () => {
    setActiveBHK(null); setActivePriceIdx(null);
    setOnlyTrending(false); setOnlyReady(false);
    setOnlyUnderConstruction(false); setOnlyNewLaunch(false);
    setOnlyEarlypossesion(false); setSortKey("relevance");
  };

  const hasFilters = activeBHK || activePriceIdx !== null || onlyTrending || onlyReady
    || onlyUnderConstruction || onlyNewLaunch || onlyEarlypossesion;

  const results = useMemo(() => {
    let list = [...allProperties];
    if (activeBHK)           list = list.filter((p) => matchesBHK(p.configuration || "", activeBHK));
    if (activePriceIdx !== null) {
      const range = PRICE_OPTIONS[activePriceIdx];
      list = list.filter((p) => {
        const price = parsePriceCr(p.pricingStartsFrom || "");
        if (price === null) return false;
        return range.max === null ? price >= range.min : price >= range.min && price < range.max;
      });
    }
    if (onlyTrending)          list = list.filter((p) => p.isTrending);
    if (onlyReady)             list = list.filter((p) => p.isReadyToMove);
    if (onlyUnderConstruction) list = list.filter((p) => p.isUnderConstruction);
    if (onlyNewLaunch)         list = list.filter((p) => p.isNewLaunch);
    if (onlyEarlypossesion)    list = list.filter((p) => p.isEarlypossesion);
    if (sortKey === "price_asc")  list.sort((a, b) => (parsePriceCr(a.pricingStartsFrom) ?? 999) - (parsePriceCr(b.pricingStartsFrom) ?? 999));
    if (sortKey === "price_desc") list.sort((a, b) => (parsePriceCr(b.pricingStartsFrom) ?? 0)   - (parsePriceCr(a.pricingStartsFrom) ?? 0));
    if (sortKey === "newest")     list.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    return list;
  }, [allProperties, activeBHK, activePriceIdx, onlyTrending, onlyReady, onlyUnderConstruction, onlyNewLaunch, onlyEarlypossesion, sortKey]);

  const stats = useMemo(() => {
    if (!allProperties.length) return null;
    const prices = allProperties.map(p => parsePriceCr(p.pricingStartsFrom || "")).filter(Boolean) as number[];
    return {
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
      trending: allProperties.filter(p => p.isTrending).length,
      ready:    allProperties.filter(p => p.isReadyToMove).length,
    };
  }, [allProperties]);

  const visiblePrices = showAllPrices ? PRICE_OPTIONS : PRICE_OPTIONS.slice(0, 5);
  const filteredOut   = allProperties.length - results.length;

  // ── 404 for unknown slugs ──
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-5">🏚️</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Locality not found
        </h1>
        <p className="text-gray-400 text-sm mb-8">We don't have a page for this locality yet.</p>
        <Link href="/" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3 rounded-2xl text-sm transition-all">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-gray-950 pt-14 pb-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-400/6 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-10">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-gray-700">›</span>
            <Link href="/" className="hover:text-amber-400 transition-colors">Localities</Link>
            <span className="text-gray-700">›</span>
            <span className="text-gray-400">{localityName}</span>
          </div>

          {/* Title block */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-3xl flex-shrink-0">
              {meta.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {localityName}
                </h1>
                {meta.trending && (
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-[11px] font-extrabold px-3 py-1 rounded-full">
                    🔥 Trending
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">{meta.tagline}</p>
              {!loading && (
                <p className="text-amber-400 text-sm font-bold mt-1">
                  {allProperties.length > 0
                    ? `${allProperties.length} propert${allProperties.length === 1 ? "y" : "ies"} available`
                    : "No properties listed yet"}
                </p>
              )}
            </div>
          </div>

          {/* Filters — only show if there are properties */}
          {!loading && allProperties.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mr-1">BHK</span>
                {BHK_OPTIONS.map((b) => (
                  <Chip key={b} label={`${b} BHK`} active={activeBHK === b} onClick={() => setActiveBHK(activeBHK === b ? null : b)} />
                ))}
                <div className="w-px h-4 bg-white/10 mx-1" />
                <Chip label="Trending"          active={onlyTrending}          onClick={() => setOnlyTrending(!onlyTrending)}                   icon="🔥" />
                <Chip label="Ready to Move"     active={onlyReady}             onClick={() => setOnlyReady(!onlyReady)}                         icon="✓"  />
                <Chip label="Under Construction"active={onlyUnderConstruction} onClick={() => setOnlyUnderConstruction(!onlyUnderConstruction)} icon="🏗" />
                <Chip label="New Launch"        active={onlyNewLaunch}         onClick={() => setOnlyNewLaunch(!onlyNewLaunch)}                  icon="🚀" />
                <Chip label="Early Possession"  active={onlyEarlypossesion}    onClick={() => setOnlyEarlypossesion(!onlyEarlypossesion)}        icon="🌏" />
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-1 text-[10px] text-gray-600 hover:text-red-400 underline transition-colors font-medium">
                    Clear all
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mr-1">Price</span>
                {visiblePrices.map((opt, idx) => (
                  <Chip key={opt.label} label={opt.label} active={activePriceIdx === idx} onClick={() => setActivePriceIdx(activePriceIdx === idx ? null : idx)} />
                ))}
                <button onClick={() => setShowAllPrices(!showAllPrices)} className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline transition-colors">
                  {showAllPrices ? "Show less" : `+${PRICE_OPTIONS.length - 5} more`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#fafaf8] to-transparent" />
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      {stats && !loading && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-3 flex flex-wrap items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              <span><strong className="text-gray-800">{allProperties.length}</strong> properties in {localityName}</span>
            </div>
            {stats.min !== null && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span>Starting from <strong className="text-gray-800">₹{stats.min < 1 ? `${Math.round(stats.min * 100)}L` : `${stats.min}Cr`}</strong></span>
              </div>
            )}
            {stats.trending > 0 && (
              <div className="flex items-center gap-1.5">
                <span>🔥</span>
                <span><strong className="text-gray-800">{stats.trending}</strong> trending</span>
              </div>
            )}
            {stats.ready > 0 && (
              <div className="flex items-center gap-1.5">
                <span>✅</span>
                <span><strong className="text-gray-800">{stats.ready}</strong> ready to move</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                {(["grid", "list"] as const).map((mode) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-1.5 rounded-md transition-all ${viewMode === mode ? "bg-white shadow text-amber-500" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {mode === "grid"
                      ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V2zM1 7a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zM1 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z"/></svg>
                      : <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2 4.5A.5.5 0 012.5 4h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zM2 8a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11A.5.5 0 012 8zm0 3.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/></svg>
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESULTS ───────────────────────────────────────────── */}
      <section className="py-10 max-w-7xl mx-auto px-8">

        {!loading && allProperties.length > 0 && results.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <p className="text-sm text-gray-500">
              Showing <span className="text-gray-900 font-bold">{results.length}</span> propert{results.length !== 1 ? "ies" : "y"} in{" "}
              <span className="text-amber-500 font-bold">{localityName}</span>
              {filteredOut > 0 && <span className="text-gray-400"> · {filteredOut} filtered out</span>}
            </p>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="text-xs bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none focus:ring-2 focus:ring-amber-400 transition font-medium"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-28">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-amber-100" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Loading properties in {localityName}…</p>
          </div>
        )}

        {/* No properties at all */}
        {!loading && allProperties.length === 0 && (
          <div className="text-center py-28">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5">🏚️</div>
            <p className="text-gray-700 text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No properties in {localityName} yet
            </p>
            <p className="text-gray-400 text-sm mb-8">
              We're working on listing properties here. Check back soon!
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3 rounded-2xl transition-all text-sm shadow">
              ← Explore other localities
            </Link>
          </div>
        )}

        {/* Filters cleared out everything */}
        {!loading && allProperties.length > 0 && results.length === 0 && (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">🔎</div>
            <p className="text-gray-600 font-semibold text-lg mb-2">No results match your filters</p>
            <p className="text-gray-400 text-sm mb-5">Try removing a filter or widening the price range</p>
            <button onClick={clearFilters} className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-sm px-6 py-3 rounded-2xl transition-all">
              Clear all filters →
            </button>
          </div>
        )}

        {/* Grid view */}
        {!loading && results.length > 0 && viewMode === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((p) => <PropertyCard key={p.id} property={p} now={now} />)}
          </div>
        )}

        {/* List view */}
        {!loading && results.length > 0 && viewMode === "list" && (
          <div className="flex flex-col gap-4">
            {results.map((property) => {
              const { primary: priceMain, sub: priceSub } = formatPrice(property.pricingStartsFrom || "");
              return (
                <Link key={property.id} href={`/property/${property.slug || property.id}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-amber-200 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex"
                >
                  <div className="relative w-48 flex-shrink-0 overflow-hidden">
                    <img src={property.images?.[0]} alt={property.projectName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {property.isTrending && (
                      <div className="absolute top-3 left-3 bg-amber-400 text-gray-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full">🔥 Trending</div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h2 className="text-base font-extrabold text-gray-900 group-hover:text-amber-500 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {property.projectName}
                        </h2>
                        <div>
                          <div className="text-amber-500 font-extrabold text-base whitespace-nowrap">{priceMain}</div>
                          {priceSub && <div className="text-gray-400 text-[9px] text-right">onwards</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                        <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {property.location}
                      </div>
                      {property.description && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{property.description}</p>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {property.configuration && <StatBadge icon="🛏" label={property.configuration} />}
                      {property.floors && <StatBadge icon="🏢" label={`${property.floors} Floors`} />}
                      {property.towers && <StatBadge icon="🗼" label={`${property.towers} Towers`} />}
                      {property.possessionDate && <StatBadge icon="📅" label={property.possessionDate} />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="h-16" />
      </section>
    </div>
  );
}