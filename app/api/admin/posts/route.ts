import { NextResponse } from "next/server";
import { upsertPostAdmin, deletePostAdmin } from "@/utils/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await upsertPostAdmin(body);
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : "저장 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deletePostAdmin(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "삭제 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
