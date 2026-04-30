// lib/withSeo.ts

import { pingGoogle } from "./seo";

export async function withSeo<T>(fn: () => Promise<T>) {
  const result = await fn();

  // trigger sitemap re-crawl (don’t block API)
  pingGoogle();

  return result;
}