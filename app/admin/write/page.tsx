"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Save, Settings, ChevronDown, ChevronUp } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { supabase, uploadImage } from "@/utils/supabase";
import type { Post } from "@/types/post";

function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
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
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<"loading" | "done">(() =>
    editId && supabase ? "loading" : "done",
  );

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  const isLoading = fetchStatus === "loading";

  useEffect(() => {
    if (!editId || !supabase) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", editId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setFetchStatus("done"); return; }
        const post = data as Post;
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setImageUrl(post.image_url || "");
        setTagsInput((post.tags ?? []).join(", "));
        setPublished(post.published);
        setFetchStatus("done");
      });
  }, [editId]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newTitle = e.target.value.replace(/\n/g, "");
      setTitle(newTitle);
      if (!editId) setSlug(generateSlug(newTitle));
    },
    [editId],
  );

  // 에디터 스크롤 → 미리보기 동기화
  const handleEditorScroll = useCallback(() => {
    if (isSyncingRef.current || !editorRef.current || !previewRef.current) return;
    isSyncingRef.current = true;
    const el = editorRef.current;
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
    const pr = previewRef.current;
    pr.scrollTop = ratio * (pr.scrollHeight - pr.clientHeight);
    requestAnimationFrame(() => { isSyncingRef.current = false; });
  }, []);

  async function handleContentPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const imageFile = Array.from(e.clipboardData.items)
      .find((item) => item.type.startsWith("image/"))
      ?.getAsFile();
    if (!imageFile) return;
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    setIsUploading(true);
    setSaveMessage(null);
    try {
      const url = await uploadImage(imageFile);
      const markdownImage = `![이미지](${url})`;
      setContent((prev) => prev.slice(0, start) + markdownImage + prev.slice(end));
    } catch {
      setSaveMessage("이미지 업로드에 실패했어요.");
    } finally {
      setIsUploading(false);
    }
  }

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
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      published: shouldPublish !== undefined ? shouldPublish : published,
    };
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      if (!res.ok) throw new Error();
      setSaveMessage(shouldPublish ? "발행되었어요!" : "임시저장 되었어요.");
      setTimeout(() => router.push("/admin"), 1000);
    } catch {
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
    <div className="h-screen bg-cream text-muted flex flex-col overflow-hidden">
      {/* Nav */}
      <nav className="flex-none w-full border-b border-border px-6 py-3 flex justify-between items-center bg-cream/90 backdrop-blur-sm z-40">
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
          {isUploading && (
            <span className="text-xs text-subtle tracking-wide animate-pulse">이미지 업로드 중...</span>
          )}
          {saveMessage && (
            <span className="text-xs text-subtle tracking-wide">{saveMessage}</span>
          )}

          <button
            onClick={() => setMetaOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase border border-border px-3 py-2"
            title="메타 정보"
          >
            <Settings size={12} />
            메타
            {metaOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
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

      {/* Meta panel (collapsible) */}
      {metaOpen && (
        <div className="flex-none border-b border-border bg-paper/60 px-8 py-5 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              슬러그
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="w-full bg-transparent border-b border-border py-1.5 text-sm font-mono text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              썸네일 이미지 URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border-b border-border py-1.5 text-sm font-mono text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              요약
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="목록에 표시될 한두 문장"
              className="w-full bg-transparent border-b border-border py-1.5 text-sm text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-semibold tracking-widest text-subtle mb-1.5 uppercase">
              태그
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="dev, AI, design"
              className="w-full bg-transparent border-b border-border py-1.5 text-sm font-mono text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
            />
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex-none px-8 pt-8 pb-4 border-b border-border/60">
        <textarea
          value={title}
          onChange={handleTitleChange}
          onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
          placeholder="제목을 입력하세요"
          rows={1}
          className="w-full bg-transparent text-3xl font-light text-muted outline-none placeholder:text-border resize-none leading-snug break-keep"
          style={{ maxWidth: "100%" }}
        />
      </div>

      {/* Split editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor pane */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0">
          <div className="flex-none px-4 py-2 border-b border-border/40 flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-widest text-subtle uppercase">Markdown</span>
          </div>
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handleContentPaste}
            onScroll={handleEditorScroll}
            placeholder={`## 제목\n\n본문을 Markdown 형식으로 작성하세요.\n\n> 인용문\n\n\`\`\`tsx\n// 코드 블록\n\`\`\``}
            className="flex-1 w-full bg-transparent px-8 py-6 text-sm font-mono text-[#555555] outline-none placeholder:text-border resize-none leading-[1.85] overflow-y-auto"
          />
        </div>

        {/* Preview pane */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-none px-4 py-2 border-b border-border/40 flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-widest text-subtle uppercase">미리보기</span>
          </div>
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto px-8 py-6"
          >
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-border text-sm text-center tracking-wide mt-16">
                왼쪽에 내용을 입력하면 여기에 미리보기가 표시돼요.
              </p>
            )}
          </div>
        </div>
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
