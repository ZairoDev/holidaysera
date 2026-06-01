export const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000];

export function isDefaultPriceRange(
  range?: [number, number] | null
): boolean {
  if (!range) return true;
  return (
    range[0] === DEFAULT_PRICE_RANGE[0] &&
    range[1] === DEFAULT_PRICE_RANGE[1]
  );
}
