/**
 * 1월 회고 글을 이미지 업로드와 함께 Supabase에 등록합니다.
 *
 * 실행 방법:
 *   npx tsx scripts/add-january-retrospective.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 .env.local에 없어요.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const BUCKET = "blog-images";
const POST_DIR = path.resolve(process.cwd(), "1월 회고");

async function uploadImage(filename: string): Promise<string> {
  const filePath = path.join(POST_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
  const storageName = `january-retrospective-${filename}`;

  console.log(`📤 업로드 중: ${filename}`);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storageName, buffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`이미지 업로드 실패 (${filename}): ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storageName);

  console.log(`   ✅ ${filename} → ${publicUrl}`);
  return publicUrl;
}

async function main() {
  // 이미지 업로드
  const curbyUrl = await uploadImage("curby.png");
  const dimSumUrl = await uploadImage("IMG_2751.JPG");

  // 마크다운 읽기 및 frontmatter 제거
  const raw = fs.readFileSync(path.join(POST_DIR, "index.md"), "utf-8");
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  let content = match ? match[1].trim() : raw;

  // 로컬 이미지 경로 → Supabase URL로 교체
  content = content.replace("./curby.png", curbyUrl);
  content = content.replace("./IMG_2751.JPG", dimSumUrl);

  const post = {
    slug: "january-retrospective",
    title: "Patch Note v26.01",
    excerpt: "정처기 필기를 준비하고, n8n으로 업무 자동화를 시도하며 1월을 보낸 이야기.",
    content,
    image_url: "",
    tags: ["회고"],
    created_at: new Date("2026-02-08").toISOString(),
    published: true,
  };

  console.log("\n📝 Supabase에 글 등록 중...");
  const { data, error } = await supabase
    .from("posts")
    .upsert(post, { onConflict: "slug" })
    .select("slug, title")
    .single();

  if (error) {
    console.error("❌ 등록 실패:", error.message);
    process.exit(1);
  }

  console.log(`\n🎉 완료! /post/${data.slug} — ${data.title}`);
}

main();
