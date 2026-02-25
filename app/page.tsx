import Header from "@/components/Header";
import PostListInfinite from "@/components/PostListInfinite";
import { getPostsPage } from "@/utils/supabase";
import { Github } from "lucide-react";

export const revalidate = 60;

const PAGE_SIZE = 10;

export default async function HomePage() {
  const { posts: initialPosts, hasMore: initialHasMore } = await getPostsPage(PAGE_SIZE, 0);

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

          <p className="text-subtle max-w-md text-sm leading-relaxed break-keep">생각과 코드 조각을 기록하는 공간</p>
        </header>

        {/* Post List - Infinite Scroll */}
        <section className="border-t">
          <PostListInfinite initialPosts={initialPosts} initialHasMore={initialHasMore} />
        </section>
      </main>
    </div>
  );
}
