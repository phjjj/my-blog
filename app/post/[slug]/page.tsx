import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ScrollTopButton from "@/components/ScrollTopButton";
import { getPostBySlug, getPosts } from "@/utils/supabase";
import Image from "next/image";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "게시글을 찾을 수 없어요" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-cream text-muted pb-32">
      <Header />

      <main className="max-w-4xl mx-auto px-6 mt-12 md:mt-24 animate-slide-up">
        {/* Back Button */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors mb-16">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          목록으로
        </Link>

        {/* Post Header */}
        <header className="mb-12 max-w-2xl mx-auto">
          <time className="text-sm font-mono text-subtle tracking-widest block mb-6">
            {formatDate(post.created_at)}
          </time>

          <h1 className="text-3xl md:text-5xl font-bold text-muted leading-tight break-keep mb-8">{post.title}</h1>

          <p className="text-subtle text-lg leading-relaxed max-w-2xl mx-auto break-keep">{post.excerpt}</p>
        </header>

        {/* Hero Image */}
        {post.image_url && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="w-full h-[260px] md:h-[380px] bg-border relative overflow-hidden">
              <div className="absolute inset-0 bg-cream/10 mix-blend-overlay z-10" />
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover grayscale-30 contrast-[0.9]"
              />
            </div>
          </div>
        )}

        {/* Post Body */}
        <div className="max-w-2xl mx-auto">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Post Footer */}
        <div className="max-w-2xl mx-auto mt-24 pt-12 border-border flex justify-between items-center text-xs font-semibold tracking-widest text-subtle">
          <p>END OF ARTICLE</p>
          <ScrollTopButton />
        </div>
      </main>
    </div>
  );
}
