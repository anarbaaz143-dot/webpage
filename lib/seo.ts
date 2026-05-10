// lib/seo.ts

export function pingGoogle() {
  try {
    fetch("https://www.google.com/ping?sitemap=https://propoye.com/sitemap.xml");
  } catch (err) {
    console.error("Google ping failed", err);
  }
}

// ADD THIS to the bottom of your existing app/lib/seo.ts

export function buildSeoUrl(locality: string, bhk?: string): string {
  const slug = locality.toLowerCase().replace(/\s+/g, "-");
  if (bhk) {
    return `/${bhk}bhk-flats-in-${slug}`;
  }
  return `/property-for-sale-in-${slug}`;
}