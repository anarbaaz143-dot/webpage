// app/sitemap-properties.xml/route.ts

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = "https://propoye.com";

  const properties = await prisma.property.findMany({
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  const urls = properties.map(p => `
    <url>
      <loc>${baseUrl}/property/${p.slug}</loc>
      <lastmod>${new Date(p.updatedAt || p.createdAt).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1</priority>
    </url>
  `).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}