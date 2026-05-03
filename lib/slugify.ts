export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 4)                          // first 4 words
    .join("-")
    .replace(/[^a-z0-9-]/g, "");         // strip special chars
}