import { MetadataRoute } from "next";

const BASE = "https://www.propoye.com";

// Add every locality your site has listings for
const LOCALITIES = [
  "taloja",
  "kharghar",
  "navi-mumbai",
  "panvel",
  "ulwe",
  "dronagiri",
  "kalamboli",
  "kamothe",
  "belapur",
  "vashi",
  "thane",
  "mumbai",
  "pune",
];

export default function sitemap(): MetadataRoute.Sitemap {

  // /property-for-sale-in-taloja  etc.
  const localityPages = LOCALITIES.map((loc) => ({
    url: `${BASE}/property-for-sale-in-${loc}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // /1bhk-flats-in-taloja, /2bhk-flats-in-taloja, /3bhk-flats-in-taloja  etc.
  const bhkPages = LOCALITIES.flatMap((loc) =>
    ["1", "2", "3"].map((bhk) => ({
      url: `${BASE}/${bhk}bhk-flats-in-${loc}`,
      changeFrequency: "daily" as const,
      priority: 0.85,
    }))
  );

  return [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/search`, priority: 0.7 },
    { url: `${BASE}/trending`, priority: 0.7 },
    ...localityPages,
    ...bhkPages,
  ];
}