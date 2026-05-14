import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Post } from "@/types/post";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

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

export async function upsertPostAdmin(
  post: Omit<Post, "id" | "created_at"> & { id?: string },
): Promise<Post> {
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요.");
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .upsert(post)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
}

export async function deletePostAdmin(id: string): Promise<void> {
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요.");
  }

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

