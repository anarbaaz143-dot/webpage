// app/sitemap-localities.xml/route.ts
export const dynamic = "force-dynamic";

const BASE = "https://propoye.com";

const LOCALITIES = [
  "taloja", "kharghar", "navi-mumbai", "panvel", "ulwe",
  "dronagiri", "kalamboli", "kamothe", "belapur", "vashi",
  "thane", "mumbai", "pune",
];

export async function GET() {
  const localityUrls = LOCALITIES.map(
    (loc) => `
  <url>
    <loc>${BASE}/property-for-sale-in-${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  ).join("");

  const bhkUrls = LOCALITIES.flatMap((loc) =>
    ["1", "2", "3"].map(
      (bhk) => `
  <url>
    <loc>${BASE}/${bhk}bhk-flats-in-${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`
    )
  ).join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${localityUrls}
${bhkUrls}
</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}