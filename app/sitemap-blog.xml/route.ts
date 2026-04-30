// app/sitemap-blog.xml/route.ts
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = "https://propoye.com";

  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const urls = blogs.map(b => `
    <url>
      <loc>${baseUrl}/blog/${b.id}</loc>
      <lastmod>${new Date(b.updatedAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
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