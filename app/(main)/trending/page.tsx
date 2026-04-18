import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TrendingPage() {
  const trendingHomes = await prisma.property.findMany({
    where: { isTrending: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[52vh] flex items-center justify-center bg-gray-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-5 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <span className="text-sm animate-pulse">🔥</span>
            Most Popular
          </div>
          <h1
            className="text-5xl md:text-7xl font-extrabold text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Trending{" "}
            <span className="text-amber-400">Properties</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            Discover the most popular homes that buyers are loving right now.
          </p>
        </div>
      </section>

      {/* ─── CARDS GRID ───────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-8">

          {trendingHomes.length > 0 && (
            <p className="text-sm text-gray-400 font-medium tracking-wide mb-10 text-center">
              Showing{" "}
              <span className="text-amber-500 font-bold">{trendingHomes.length}</span>{" "}
              trending {trendingHomes.length === 1 ? "property" : "properties"}
            </p>
          )}

          {trendingHomes.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🏠</div>
              <p className="text-gray-400 text-lg font-medium">No trending properties available right now.</p>
              <p className="text-gray-300 text-sm mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {trendingHomes.map((home: (typeof trendingHomes)[0], index: number) => (
                <Link
                  key={home.id}
                  href={`/property/${home.id}`}
                  className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-amber-200 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 relative"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={home.images?.[0]}
                      alt={home.projectName}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      🔥 Trending
                    </div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* ✅ projectName */}
                    <h2
                      className="text-lg font-extrabold mb-2 text-gray-900 group-hover:text-amber-500 transition-colors duration-300 leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {home.projectName}
                    </h2>

                    {/* ✅ location */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-2">
                      <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {home.location}
                    </div>

                    {/* ✅ pricingStartsFrom */}
                    {home.pricingStartsFrom && (
                      <div className="text-amber-500 text-sm font-bold mb-3">{home.pricingStartsFrom}</div>
                    )}

                    {/* ✅ configuration + possessionDate pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {home.configuration && (
                        <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          {home.configuration}
                        </span>
                      )}
                      {home.possessionDate && (
                        <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          📅 {home.possessionDate}
                        </span>
                      )}
                      {home.floors && (
                        <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          {home.floors} Floors
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400 group-hover:text-amber-500 transition-colors duration-300">
                      View Property
                      <svg
                        className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
