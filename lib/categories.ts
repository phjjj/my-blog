export const CATEGORIES = [
  { key: "dev", en: "DEV" },
  { key: "design", en: "DESIGN" },
  { key: "retrospect", en: "RETROSPECT" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const CATEGORY_KEYS: CategoryKey[] = CATEGORIES.map((c) => c.key);

export function isCategoryKey(value: string | null | undefined): value is CategoryKey {
  return !!value && (CATEGORY_KEYS as string[]).includes(value);
}

