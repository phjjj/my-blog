"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PostCard from "./PostCard";
import type { Post } from "@/types/post";
import { CATEGORIES, isCategoryKey, type CategoryKey } from "@/lib/categories";
import type { CategoryCounts } from "@/utils/supabase";

const PAGE_SIZE = 10;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

interface FilteredPostListProps {
  initialPosts: Post[];
  initialHasMore: boolean;
  initialCategory?: CategoryKey;
  counts: CategoryCounts;
  recentPosts: Post[];
}

export default function FilteredPostList({
  initialPosts,
  initialHasMore,
  initialCategory,
  counts,
  recentPosts,
}: FilteredPostListProps) {
  const [category, setCategory] = useState<CategoryKey | undefined>(initialCategory);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  async function handleCategoryChange(next?: CategoryKey) {
    if (next === category) return;
    setCategory(next);
    setIsLoading(true);
    // URL sync without server re-render
    window.history.replaceState(null, "", next ? `/?category=${next}` : "/");
    const catParam = next ? `&category=${next}` : "";
    const res = await fetch(`/api/posts?page=1&limit=${PAGE_SIZE}${catParam}`);
    const data = await res.json();
    setPosts(data.posts ?? []);
    setHasMore(Boolean(data.hasMore));
    setPage(1);
    setIsLoading(false);
  }

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const catParam = category ? `&category=${category}` : "";
    const res = await fetch(`/api/posts?page=${nextPage}&limit=${PAGE_SIZE}${catParam}`);
    const data = await res.json();
    setPosts((prev) => [...prev, ...(data.posts ?? [])]);
    setHasMore(Boolean(data.hasMore));
    setPage(nextPage);
    setIsLoading(false);
  }, [page, hasMore, isLoading, category]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
            !category
              ? "bg-crimson text-cream border-crimson"
              : "border-border text-subtle hover:text-crimson hover:border-crimson"
          }`}
        >
          전체 ({counts.total})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => handleCategoryChange(c.key)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              category === c.key
                ? "bg-crimson text-cream border-crimson"
                : "border-border text-subtle hover:text-crimson hover:border-crimson"
            }`}
          >
            {c.en} ({counts[c.key]})
          </button>
        ))}
      </div>

      {/* Content + Sidebar */}
      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
        <section className="border-t min-w-0">
          {posts.length === 0 && !isLoading ? (
            <div className="py-24 text-center text-subtle text-sm tracking-widest">
              아직 게시글이 없어요.
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <div ref={sentinelRef} className="h-4" aria-hidden />
              {isLoading && (
                <div className="py-8 text-center text-subtle text-sm tracking-widest">
                  불러오는 중...
                </div>
              )}
            </>
          )}
        </section>

        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:flex flex-col gap-8 pt-0">
          <div>
            <h3 className="text-[11px] font-bold text-crimson tracking-[0.12em] mb-3">CATEGORY</h3>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => handleCategoryChange(c.key)}
                className="w-full flex justify-between items-center text-xs text-muted py-1.5 border-b border-border/60 hover:text-crimson transition-colors"
              >
                <span>{c.en}</span>
                <span className="text-subtle">{counts[c.key]}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-crimson tracking-[0.12em] mb-3">RECENT</h3>
            {recentPosts.map((p) => (
              <Link key={p.id} href={`/post/${p.slug}`} className="block mb-2.5 group">
                <div className="text-xs text-muted leading-snug break-keep group-hover:text-crimson transition-colors line-clamp-2">
                  {p.title}
                </div>
                <div className="text-[10px] text-subtle mt-0.5">{formatDate(p.created_at)}</div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
