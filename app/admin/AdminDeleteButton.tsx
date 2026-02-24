"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/utils/supabase";

export default function AdminDeleteButton({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("정말로 이 게시글을 삭제할까요?")) return;
    const success = await deletePost(postId);
    if (success) {
      router.refresh();
    } else {
      alert("삭제에 실패했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase border border-border px-3 py-2"
    >
      <Trash2 size={12} />
      삭제
    </button>
  );
}
