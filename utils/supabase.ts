import { createClient } from "@supabase/supabase-js";
import type { Post } from "@/types/post";
import { MOCK_POSTS } from "@/lib/mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your-supabase-url" &&
  supabaseAnonKey !== "your-supabase-anon-key";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

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
): Promise<{ posts: Post[]; hasMore: boolean }> {
  if (!supabase) {
    const posts = MOCK_POSTS.slice(offset, offset + limit);
    return { posts, hasMore: offset + limit < MOCK_POSTS.length };
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[supabase] getPostsPage error:", error.message);
    const posts = MOCK_POSTS.slice(offset, offset + limit);
    return { posts, hasMore: offset + limit < MOCK_POSTS.length };
  }

  const posts = (data ?? []) as Post[];
  const hasMore = posts.length === limit;
  return { posts, hasMore };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabase) {
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("[supabase] getPostBySlug error:", error.message);
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }

  return data as Post;
}

// ─── Admin API (requires service role / auth) ─────────────────────────────────

export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!supabase) return MOCK_POSTS;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] getAllPostsForAdmin error:", error.message);
    return MOCK_POSTS;
  }

  return data as Post[];
}

export async function upsertPost(
  post: Omit<Post, "id" | "created_at"> & { id?: string },
): Promise<Post | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .upsert(post)
    .select()
    .single();

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
