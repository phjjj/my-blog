import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.slug}`}>
      <article className="group px-4 flex flex-col md:flex-row justify-between items-start py-8 border-b border-border gap-8 hover:bg-black/4 transition-colors cursor-pointer">
        {/* Text Content */}
        <div className="flex-1 order-2 md:order-1">
          <div className="flex items-center gap-3 mb-2">
            <time className="text-xs font-mono text-subtle tracking-widest">{formatDate(post.created_at)}</time>
          </div>

          <div className="inline-flex items-start gap-2 group-hover:gap-3 transition-all mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-crimson break-keep">{post.title}</h2>
          </div>

          <p className="text-subtle text-sm leading-relaxed max-w-2xl break-keep">{post.excerpt}</p>
        </div>

        {/* Square Thumbnail */}
        <div className="order-1 md:order-2 shrink-0 overflow-hidden bg-border w-full md:w-32 h-48 md:h-32 relative group-hover:opacity-80 transition-opacity">
          <div className="absolute inset-0 bg-cream/10 mix-blend-overlay z-10" />
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 8rem"
            className="object-cover grayscale-40 contrast-[0.9]"
          />
        </div>
      </article>
    </Link>
  );
}
