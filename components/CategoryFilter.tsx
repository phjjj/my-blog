"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryCounts } from "@/utils/supabase";

interface CategoryFilterProps {
  counts: CategoryCounts;
  activeCategory?: string;
}

export default function CategoryFilter({ counts, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => router.push(href, { scroll: false }));
  }

  return (
    <div className={`flex flex-wrap gap-2 mb-8 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <button
        onClick={() => navigate("/")}
        className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
          !activeCategory
            ? "bg-crimson text-cream border-crimson"
            : "border-border text-subtle hover:text-crimson hover:border-crimson"
        }`}
      >
        전체 ({counts.total})
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          onClick={() => navigate(`/?category=${c.key}`)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
            activeCategory === c.key
              ? "bg-crimson text-cream border-crimson"
              : "border-border text-subtle hover:text-crimson hover:border-crimson"
          }`}
        >
          {c.en} ({counts[c.key]})
        </button>
      ))}
    </div>
  );
}
