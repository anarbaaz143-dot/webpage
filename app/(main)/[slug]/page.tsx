import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

interface ParsedSlug {
  bhk: string | null;
  locality: string;
  rawLocality: string;
  pageTitle: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  canonicalSlug: string;
}

export function parseSlug(slug: string): ParsedSlug | null {
  const bhkMatch = slug.match(/^(\d\+?)(bhk)-flats-in-(.+)$/i);
  if (bhkMatch) {
    const bhk = bhkMatch[1] === "4+" ? "4+" : bhkMatch[1];
    const rawLocality = bhkMatch[3];
    const locality = rawLocality
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      bhk,
      locality,
      rawLocality,
      pageTitle: `${bhk} BHK Flats in ${locality}`,
      h1: `${bhk} BHK Flats for Sale in ${locality}`,
      metaTitle: `${bhk} BHK Flats in ${locality} | Buy ${bhk} BHK Apartments — Propoye`,
      metaDescription: `Browse verified ${bhk} BHK flats in ${locality}. Compare prices, floor plans, and possession dates. 0% brokerage on all listings at Propoye.`,
      canonicalSlug: slug.toLowerCase(),
    };
  }

  const genericMatch = slug.match(/^property-for-sale-in-(.+)$/i);
  if (genericMatch) {
    const rawLocality = genericMatch[1];
    const locality = rawLocality
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      bhk: null,
      locality,
      rawLocality,
      pageTitle: `Properties in ${locality}`,
      h1: `Property for Sale in ${locality}`,
      metaTitle: `Property for Sale in ${locality} | Flats & Apartments — Propoye`,
      metaDescription: `Explore verified properties for sale in ${locality}. Find 1, 2 & 3 BHK flats, apartments, and projects with 0% brokerage. Propoye — India's trusted property platform.`,
      canonicalSlug: slug.toLowerCase(),
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const baseUrl = "https://www.propoye.com";
  return {
    title: parsed.metaTitle,
    description: parsed.metaDescription,
    alternates: { canonical: `${baseUrl}/${parsed.canonicalSlug}` },
    openGraph: {
      title: parsed.metaTitle,
      description: parsed.metaDescription,
      url: `${baseUrl}/${parsed.canonicalSlug}`,
      siteName: "Propoye",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: parsed.metaTitle,
      description: parsed.metaDescription,
    },
  };
}

export default async function SeoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) {
    redirect(`/search?q=${slug}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.propoye.com";
  const apiUrl = parsed.bhk
    ? `${baseUrl}/api/property?search=${encodeURIComponent(parsed.locality)}&bhk=${parsed.bhk}`
    : `${baseUrl}/api/property?search=${encodeURIComponent(parsed.locality)}`;

  let properties: any[] = [];
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    properties = await res.json();
  } catch {
    properties = [];
  }

  if (parsed.bhk) {
    const bhkRegex = parsed.bhk === "4+"
      ? /[4-9]\s*BHK/i
      : new RegExp(`${parsed.bhk}\\s*BHK`, "i");
    properties = properties.filter((p) => bhkRegex.test(p.configuration || ""));
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Properties", item: `${baseUrl}/search` },
      { "@type": "ListItem", position: 3, name: parsed.pageTitle, item: `${baseUrl}/${parsed.canonicalSlug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="bg-gray-950 pt-14 pb-10 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-gray-500 mb-6 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/search" className="hover:text-amber-400 transition-colors">Properties</Link>
            <span>›</span>
            <span className="text-gray-400">{parsed.locality}</span>
            {parsed.bhk && (
              <>
                <span>›</span>
                <span className="text-gray-400">{parsed.bhk} BHK</span>
              </>
            )}
          </nav>

          <h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {parsed.bhk
              ? <>{parsed.bhk} BHK Flats in <span className="text-amber-400">{parsed.locality}</span></>
              : <>Property for Sale in <span className="text-amber-400">{parsed.locality}</span></>
            }
          </h1>

          <p className="text-gray-400 text-sm mb-4">
            {properties.length > 0
              ? `${properties.length} verified ${parsed.bhk ? `${parsed.bhk} BHK ` : ""}properties found in ${parsed.locality}`
              : `Explore properties in ${parsed.locality}`}
          </p>

          {!parsed.bhk && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["1", "2", "3"].map((b) => (
                <Link
                  key={b}
                  href={`/${b}bhk-flats-in-${parsed.rawLocality}`}
                  className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-full hover:border-amber-400/50 hover:text-amber-300 transition-all font-medium"
                >
                  {b} BHK in {parsed.locality}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-8">
        {properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">🏚️</div>
            <p className="text-gray-700 text-xl font-bold mb-2">No properties found</p>
            <p className="text-gray-400 text-sm">Try browsing all properties in {parsed.locality}</p>
            <Link
              href={`/search?q=${parsed.locality}`}
              className="mt-6 inline-block bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-2xl text-sm"
            >
              Search {parsed.locality} →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property: any) => (
              <a
                key={property.id}
                href={`/property/${property.slug || property.id}`}
                className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-amber-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={property.images?.[0]}
                    alt={`${property.projectName} in ${parsed.locality}`}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-lg font-extrabold">
                    {property.pricingStartsFrom}
                  </div>
                </div>
                <div className="p-5">
                  <h2
                    className="font-extrabold text-gray-900 group-hover:text-amber-500 transition-colors mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {property.projectName}
                  </h2>
                  <p className="text-xs text-gray-400">{property.location}</p>
                  {property.configuration && (
                    <p className="text-xs text-amber-600 font-semibold mt-1">{property.configuration}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}