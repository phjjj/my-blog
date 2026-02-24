import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import { getPosts } from "@/utils/supabase";
import { Github } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-cream text-muted pb-32">
      <Header />

      <main className="max-w-4xl mx-auto px-6 mt-12 md:mt-24 animate-fade-in">
        {/* MUJI Style Hero Header */}
        <header className="mb-24 flex flex-col items-center justify-center text-center">
          <div className="text-crimson text-xs font-bold tracking-[0.4em] mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-crimson" />
            개발일지
            <span className="w-8 h-px bg-crimson" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8">PHJ</h1>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-subtle hover:text-crimson transition-colors mb-8"
            aria-label="GitHub">
            <Github size={24} strokeWidth={2} />
          </a>

          <p className="text-subtle max-w-md text-sm leading-relaxed break-keep">
            생각과 코드 조각, 그리고 아키텍처 탐구에 대한 디지털 아카이브. 소프트웨어를 만들어가는 여정을 기록합니다.
          </p>
        </header>

        {/* Post List */}
        <section className="border-t border-border">
          {posts.length === 0 ? (
            <div className="py-24 text-center text-subtle text-sm tracking-widest">아직 게시글이 없어요.</div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>

        <Footer currentPage={1} totalPages={Math.ceil(posts.length / 10) || 1} />
      </main>
    </div>
  );
}
