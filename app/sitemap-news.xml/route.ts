// app/sitemap-news.xml/route.ts

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = "https://propoye.com";

  const news = await prisma.news.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const urls = news.map(n => `
    <url>
      <loc>${baseUrl}/news/${n.id}</loc>
      <lastmod>${new Date(n.updatedAt).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}