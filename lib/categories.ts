export const CATEGORIES = [
  { key: "dev", label: "개발", en: "DEV" },
  { key: "design", label: "디자인", en: "DESIGN" },
  { key: "retrospect", label: "회고", en: "RETROSPECT" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const CATEGORY_KEYS: CategoryKey[] = CATEGORIES.map((c) => c.key);

export function isCategoryKey(value: string | null | undefined): value is CategoryKey {
  return !!value && (CATEGORY_KEYS as string[]).includes(value);
}

export function categoryLabel(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}
