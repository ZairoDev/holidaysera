/** Keep only non-empty image URL strings. */
export function filterValidImageUrls(urls: unknown): string[] {
  if (!Array.isArray(urls)) return [];
  return urls.filter(
    (url): url is string => typeof url === "string" && url.trim().length > 0
  );
}

/** Prefer `propertyPictureUrls`, fall back to legacy `propertyImages`. */
export function resolvePropertyImageUrls(
  pictureUrls: unknown,
  legacyImages: unknown
): string[] {
  const primary = filterValidImageUrls(pictureUrls);
  if (primary.length > 0) return primary;
  return filterValidImageUrls(legacyImages);
}
