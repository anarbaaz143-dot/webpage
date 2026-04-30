// lib/seo.ts

export function pingGoogle() {
  try {
    fetch("https://www.google.com/ping?sitemap=https://propoye.com/sitemap.xml");
  } catch (err) {
    console.error("Google ping failed", err);
  }
}