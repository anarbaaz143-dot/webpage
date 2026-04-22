export function slugify(name: string, propoyeId: string): string {
  const namePart = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${namePart}-${propoyeId.toLowerCase()}`;
}

export function extractIdFromSlug(slug: string, propoyeId: string): string {
  return propoyeId;
}