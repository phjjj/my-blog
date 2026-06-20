"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TagCounts } from "@/utils/supabase";

interface CategoryFilterProps {
  counts: TagCounts;
  activeTag?: string;
}

export default function CategoryFilter({ counts, activeTag }: CategoryFilterProps) {
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
          !activeTag
            ? "bg-crimson text-cream border-crimson"
            : "border-border text-subtle hover:text-crimson hover:border-crimson"
        }`}
      >
        전체 ({counts.total})
      </button>
      {Object.entries(counts.tags).map(([tag, count]) => (
        <button
          key={tag}
          onClick={() => navigate(`/?tag=${encodeURIComponent(tag)}`)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
            activeTag === tag
              ? "bg-crimson text-cream border-crimson"
              : "border-border text-subtle hover:text-crimson hover:border-crimson"
          }`}
        >
          {tag} ({count})
        </button>
      ))}
    </div>
  );
}
