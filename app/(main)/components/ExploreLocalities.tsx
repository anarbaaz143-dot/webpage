"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: string;
  slug?: string;
  location: string;
  pricingStartsFrom?: string;
  isTrending?: boolean;
};

type Locality = {
  name: string;
  avgPrice: number;
  slug?: string;
};

export default function ExploreLocalities() {
  const router = useRouter();
  const [localities, setLocalities] = useState<Locality[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/property");
      const data: Property[] = await res.json();

      if (!data || data.length === 0) return;

      // ── 1. Get 2 trending ──
      const trending = data.filter(p => p.isTrending).slice(0, 2);

      // ── 2. Get 4 random (excluding trending) ──
      const nonTrending = data.filter(p => !p.isTrending);
      const shuffled = [...nonTrending].sort(() => 0.5 - Math.random());
      const random = shuffled.slice(0, 4);

      const selected = [...trending, ...random];

      if (selected.length === 0) return;

      // ── 3. Group by locality ──
      const map: Record<string, number[]> = {};

      selected.forEach(p => {
        if (!p.location || !p.pricingStartsFrom) return;

        const price = parsePrice(p.pricingStartsFrom);
        if (!price) return;

        if (!map[p.location]) map[p.location] = [];
        map[p.location].push(price);
      });

      // ── 4. Build result with slug ──
      const result: Locality[] = Object.entries(map).map(([name, prices]) => {
        const firstProperty = selected.find(p => p.location === name);

        return {
          name,
          avgPrice: Math.round(
            prices.reduce((a, b) => a + b, 0) / prices.length
          ),
          slug: firstProperty?.slug || firstProperty?.id,
        };
      });

      setLocalities(result);
    };

    fetchData();
  }, []);

  // ── Hide section if no data ──
  if (!localities.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Explore Localities
        </h2>

        <p className="text-gray-400 text-sm mb-10">
          See insights and average prices across top areas
        </p>

        {/* Cards */}
        <div className="flex flex-wrap gap-4">
          {localities.map((loc, i) => (
            <div
              key={i}
              onClick={() => {
                if (!loc.slug) return;
                router.push(`/property/${loc.slug}`);
              }}
              className="relative px-6 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.97] hover:shadow-md min-w-[150px]"
            >
              {/* Trending ribbon */}
              {i < 2 && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-br-lg font-semibold tracking-wide">
                  TRENDING
                </div>
              )}

              <h3 className="font-semibold text-gray-800 text-sm">
                {loc.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Avg Price: ₹{loc.avgPrice.toLocaleString()} / Sq.ft.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Helper: extract number from ₹ string ──
function parsePrice(priceStr: string) {
  const num = priceStr.replace(/[^\d]/g, "");
  return num ? parseInt(num) : null;
}