export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(`User-agent: *
Allow: /

Sitemap: https://propoye.com/sitemap.xml
`, {
    headers: { "Content-Type": "text/plain" },
  });
}