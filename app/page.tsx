import Link from "next/link";
import Header from "@/components/Header";
import PostListInfinite from "@/components/PostListInfinite";
import CategoryFilter from "@/components/CategoryFilter";
import { getPostsPage, getCategoryCounts } from "@/utils/supabase";
import { CATEGORIES, isCategoryKey } from "@/lib/categories";
import { Github } from "lucide-react";

export const revalidate = 60;

const PAGE_SIZE = 10;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const category = isCategoryKey(categoryParam) ? categoryParam : undefined;

  const [{ posts: initialPosts, hasMore: initialHasMore }, counts, { posts: recentPosts }] =
    await Promise.all([
      getPostsPage(PAGE_SIZE, 0, category),
      getCategoryCounts(),
      getPostsPage(5, 0),
    ]);

  return (
    <div className="min-h-screen bg-cream text-muted pb-32">
      <Header />

      <main className="max-w-4xl mx-auto px-6 mt-12 md:mt-24 animate-fade-in">
        {/* MUJI Style Hero Header */}
        <header className="mb-16 flex flex-col items-center justify-center text-center">
          <div className="text-crimson text-xs font-bold tracking-[0.4em] mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-crimson" />
            개발일지
            <span className="w-8 h-px bg-crimson" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8">PHJ</h1>

          <a
            href="https://github.com/phjjj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-subtle hover:text-crimson transition-colors mb-8"
            aria-label="GitHub">
            <Github />
          </a>

          <p className="text-subtle max-w-md text-sm leading-relaxed break-keep">개발 기록 노트</p>
        </header>

        {/* Category Filter — client component for instant feedback */}
        <CategoryFilter counts={counts} activeCategory={category} />

        {/* Content + Sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
          <section className="border-t min-w-0">
            <PostListInfinite key={category ?? "all"} initialPosts={initialPosts} initialHasMore={initialHasMore} category={category} />
          </section>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:flex flex-col gap-8 pt-8">
            <div>
              <h3 className="text-[11px] font-bold text-crimson tracking-[0.12em] mb-3">CATEGORY</h3>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/?category=${c.key}`}
                  scroll={false}
                  className="flex justify-between items-center text-xs text-muted py-1.5 border-b border-border/60 hover:text-crimson transition-colors"
                >
                  <span>{c.label}</span>
                  <span className="text-subtle">{counts[c.key]}</span>
                </Link>
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
      </main>
    </div>
  );
}
