"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Save } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { upsertPost, supabase } from "@/utils/supabase";
import type { Post } from "@/types/post";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function AdminWritePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<"loading" | "done">(() =>
    editId && supabase ? "loading" : "done",
  );
  const isLoading = fetchStatus === "loading";

  useEffect(() => {
    if (!editId || !supabase) return;

    supabase
      .from("posts")
      .select("*")
      .eq("id", editId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setFetchStatus("done");
          return;
        }
        const post = data as Post;
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setImageUrl(post.image_url || "");
        setPublished(post.published);
        setFetchStatus("done");
      });
  }, [editId]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      if (!editId) {
        setSlug(generateSlug(newTitle));
      }
    },
    [editId],
  );

  async function handleSave(shouldPublish?: boolean) {
    if (!title.trim() || !content.trim()) {
      setSaveMessage("제목과 본문을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const postData = {
      ...(editId ? { id: editId } : {}),
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image_url: imageUrl.trim(),
      tags: [],
      published: shouldPublish !== undefined ? shouldPublish : published,
    };

    const result = await upsertPost(postData);

    if (result) {
      setSaveMessage(shouldPublish ? "발행되었어요!" : "임시저장 되었어요.");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } else {
      setSaveMessage("저장에 실패했어요. 다시 시도해 주세요.");
    }

    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-subtle tracking-widest">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-muted">
      {/* Editor Nav */}
      <nav className="w-full border-b border-border px-6 py-4 flex justify-between items-center bg-cream/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase"
          >
            ← 목록
          </Link>
          <span className="text-border text-xs">|</span>
          <span className="text-xs font-semibold tracking-widest text-muted uppercase">
            {editId ? "글 수정" : "새 글 쓰기"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs text-subtle tracking-wide">
              {saveMessage}
            </span>
          )}

          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase border border-border px-3 py-2"
          >
            {isPreview ? <EyeOff size={12} /> : <Eye size={12} />}
            {isPreview ? "편집" : "미리보기"}
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase border border-border px-3 py-2 disabled:opacity-50"
          >
            <Save size={12} />
            임시저장
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest bg-crimson text-cream hover:bg-[#6a0015] transition-colors uppercase px-4 py-2 disabled:opacity-50"
          >
            발행하기
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Metadata Fields */}
        <div className="space-y-5 mb-10 pb-10 border-b border-border">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="게시글 제목을 입력하세요"
              className="w-full bg-transparent border-b border-border py-2 text-2xl font-light text-muted outline-none focus:border-crimson transition-colors placeholder:text-border break-keep"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
                슬러그 (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug-here"
                className="w-full bg-transparent border border-border px-3 py-2 text-sm font-mono text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              요약 (목록에 표시)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="게시글을 간략하게 소개하는 한두 문장을 작성하세요"
              rows={2}
              className="w-full bg-transparent border border-border px-3 py-2 text-sm text-muted outline-none focus:border-crimson transition-colors placeholder:text-border resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              썸네일 이미지 URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-transparent border border-border px-3 py-2 text-sm font-mono text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
            />
          </div>
        </div>

        {/* Editor / Preview */}
        {isPreview ? (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <p className="text-[10px] font-semibold tracking-widest text-subtle uppercase mb-8 text-center">
              미리보기
            </p>
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-border text-sm text-center tracking-wide">
                본문을 입력하면 여기에 미리보기가 표시돼요.
              </p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-3 uppercase">
              본문 (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`## 제목\n\n본문을 Markdown 형식으로 작성하세요.\n\n> 인용문\n\n\`\`\`tsx\n// 코드 블록\n\`\`\``}
              className="w-full bg-paper border border-border px-5 py-4 text-sm font-mono text-[#555555] outline-none focus:border-crimson transition-colors placeholder:text-border resize-none leading-relaxed"
              style={{ minHeight: "60vh" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminWritePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-sm text-subtle tracking-widest">불러오는 중...</p>
        </div>
      }
    >
      <AdminWritePageInner />
    </Suspense>
  );
}
