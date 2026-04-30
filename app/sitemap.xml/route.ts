// app/sitemap.xml/route.ts
export const dynamic = "force-dynamic";
export async function GET() {
  const baseUrl = "https://propoye.com";

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      
      <sitemap>
        <loc>${baseUrl}/sitemap-properties.xml</loc>
      </sitemap>

      <sitemap>
        <loc>${baseUrl}/sitemap-blog.xml</loc>
      </sitemap>

      <sitemap>
        <loc>${baseUrl}/sitemap-news.xml</loc>
      </sitemap>

    </sitemapindex>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}