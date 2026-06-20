import { createClient } from "@supabase/supabase-js";
import type { Post } from "@/types/post";
import { MOCK_POSTS } from "@/lib/mockData";
import { CATEGORY_KEYS, type CategoryKey } from "@/lib/categories";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== "your-supabase-url" && supabaseAnonKey !== "your-supabase-anon-key";

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

// ─── Public API ──────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 10;

export async function getPosts(): Promise<Post[]> {
  if (!supabase) return MOCK_POSTS;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] getPosts error:", error.message);
    return MOCK_POSTS;
  }

  return data as Post[];
}

export async function getPostsPage(
  limit: number = DEFAULT_PAGE_SIZE,
  offset: number = 0,
  category?: CategoryKey,
): Promise<{ posts: Post[]; hasMore: boolean }> {
  if (!supabase) {
    const all = category ? MOCK_POSTS.filter((p) => p.tags.includes(category)) : MOCK_POSTS;
    const posts = all.slice(offset, offset + limit);
    return { posts, hasMore: offset + limit < all.length };
  }

  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (category) query = query.contains("tags", [category]);

  const { data, error } = await query;

  if (error) {
    console.error("[supabase] getPostsPage error:", error.message);
    const all = category ? MOCK_POSTS.filter((p) => p.tags.includes(category)) : MOCK_POSTS;
    const posts = all.slice(offset, offset + limit);
    return { posts, hasMore: offset + limit < all.length };
  }

  const posts = (data ?? []) as Post[];
  const hasMore = posts.length === limit;
  return { posts, hasMore };
}

export type CategoryCounts = { total: number } & Record<CategoryKey, number>;

function tallyCounts(tagArrays: string[][]): CategoryCounts {
  const counts = { total: tagArrays.length } as CategoryCounts;
  for (const key of CATEGORY_KEYS) counts[key] = 0;
  for (const tags of tagArrays) {
    for (const t of tags) {
      if (t in counts && t !== "total") counts[t as CategoryKey] += 1;
    }
  }
  return counts;
}

// ponytail: 전체 published category 1회 조회 후 메모리 집계, 글 수천 넘어가면 group-by RPC로
export async function getCategoryCounts(): Promise<CategoryCounts> {
  if (!supabase) {
    return tallyCounts(MOCK_POSTS.map((p) => p.tags));
  }

  const { data, error } = await supabase.from("posts").select("tags").eq("published", true);

  if (error) {
    console.error("[supabase] getCategoryCounts error:", error.message);
    return tallyCounts(MOCK_POSTS.map((p) => p.tags));
  }

  return tallyCounts((data ?? []).map((r) => (r as { tags: string[] }).tags ?? []));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabase) {
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).limit(1);

  if (error) {
    console.error("[supabase] getPostBySlug error:", error.message);
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const row = data?.[0];
  return row ? (row as Post) : (MOCK_POSTS.find((p) => p.slug === slug) ?? null);
}

// ─── Admin API (requires service role / auth) ─────────────────────────────────

export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!supabase) return MOCK_POSTS;

  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] getAllPostsForAdmin error:", error.message);
    return MOCK_POSTS;
  }

  return data as Post[];
}

export async function upsertPost(post: Omit<Post, "id" | "created_at"> & { id?: string }): Promise<Post | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from("posts").upsert(post).select().single();

  if (error) {
    console.error("[supabase] upsertPost error:", error.message);
    return null;
  }

  return data as Post;
}

export async function deletePost(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("[supabase] deletePost error:", error.message);
    return false;
  }

  return true;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_BUCKET = "blog-images";

/**
 * 이미지 파일을 Supabase Storage에 업로드하고 공개 URL을 반환합니다.
 * 로그인된 사용자(어드민)만 호출해야 합니다.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았어요.");

  const ext = file.name.split(".").pop() ?? "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filename, file, { upsert: false });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

  return publicUrl;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase가 설정되지 않았어요.");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
