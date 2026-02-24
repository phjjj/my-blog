import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Post } from "@/types/post";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

/**
 * 서버 전용: 임시저장(published=false) 포함 전체 글 조회.
 * RLS를 우회하므로 service_role 키는 절대 클라이언트에 노출되면 안 됩니다.
 */
export async function getAllPostsForAdmin(): Promise<Post[]> {
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요. .env.local에 SUPABASE_SERVICE_ROLE_KEY를 추가해 주세요.",
    );
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Post[];
}

