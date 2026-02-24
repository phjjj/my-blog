import Link from "next/link";
import { PenLine, Eye, EyeOff } from "lucide-react";
import { getAllPostsForAdmin } from "@/utils/supabase";
import AdminDeleteButton from "./AdminDeleteButton";
import AdminSignOutButton from "./AdminSignOutButton";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AdminPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="min-h-screen bg-cream text-muted pb-32">
      {/* Admin Header */}
      <nav className="w-full border-b border-border px-8 py-5 flex justify-between items-center bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase"
          >
            ← 블로그로
          </Link>
          <span className="text-border">|</span>
          <span className="text-xs font-semibold tracking-widest text-muted uppercase">
            관리자
          </span>
        </div>

        <AdminSignOutButton />
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 border-b border-border pb-8">
          <div>
            <div className="text-crimson text-xs font-bold tracking-[0.4em] mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-crimson" />
              ADMIN
            </div>
            <h1 className="text-3xl font-light tracking-widest text-muted">
              글 관리
            </h1>
          </div>

          <Link
            href="/admin/write"
            className="flex items-center gap-2 bg-crimson text-cream text-xs font-semibold tracking-widest uppercase px-5 py-3 hover:bg-[#6a0015] transition-colors"
          >
            <PenLine size={14} />새 글 쓰기
          </Link>
        </div>

        {/* Post Table */}
        <section>
          {posts.length === 0 ? (
            <div className="py-24 text-center text-subtle text-sm tracking-widest">
              아직 게시글이 없어요.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-subtle tracking-widest">
                        {formatDate(post.created_at)}
                      </span>
                      {post.published ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted uppercase">
                          <Eye size={11} />
                          발행됨
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-subtle uppercase">
                          <EyeOff size={11} />
                          임시저장
                        </span>
                      )}
                    </div>
                    <p className="text-base text-muted truncate break-keep">
                      {post.title}
                    </p>
                    <p className="text-xs text-subtle mt-0.5 font-mono">
                      /post/{post.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/admin/write?id=${post.id}`}
                      className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase border border-border px-3 py-2"
                    >
                      <PenLine size={12} />
                      수정
                    </Link>
                    <AdminDeleteButton postId={post.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
