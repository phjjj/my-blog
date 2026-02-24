"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/types/post";

const PAGE_SIZE = 10;

interface PostListInfiniteProps {
  initialPosts: Post[];
  initialHasMore: boolean;
}

export default function PostListInfinite({
  initialPosts,
  initialHasMore,
}: PostListInfiniteProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(
        `/api/posts?page=${nextPage}&limit=${PAGE_SIZE}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch");
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setHasMore(Boolean(data.hasMore));
      setPage(nextPage);
    } catch {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center text-subtle text-sm tracking-widest">
        아직 게시글이 없어요.
      </div>
    );
  }

  return (
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
  );
}
