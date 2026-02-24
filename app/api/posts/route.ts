import { NextResponse } from "next/server";
import { getPostsPage } from "@/utils/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
  const offset = (page - 1) * limit;

  const { posts, hasMore } = await getPostsPage(limit, offset);
  return NextResponse.json({ posts, hasMore });
}
