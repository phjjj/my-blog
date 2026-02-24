import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ScrollTopButton from "@/components/ScrollTopButton";
import { getPostBySlug, getPosts } from "@/utils/supabase";
import Image from "next/image";
import { resolveThumbnail } from "@/lib/postUtils";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: encodeURIComponent(post.slug) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  if (!post) return { title: "게시글을 찾을 수 없어요" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: resolveThumbnail(post.image_url, post.content)
        ? [{ url: resolveThumbnail(post.image_url, post.content)! }]
        : [],
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  if (!post) notFound();

  const heroImage = resolveThumbnail(post.image_url, post.content);

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
        {heroImage && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="w-full bg-paper relative overflow-hidden">
              <Image
                src={heroImage}
                alt={post.title}
                width={672}
                height={0}
                sizes="(max-width: 768px) 100vw, 672px"
                className="w-full h-auto grayscale-30 contrast-[0.9]"
                style={{ height: "auto" }}
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
