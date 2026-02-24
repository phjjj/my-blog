/**
 * content/ 폴더의 마크다운 파일들을 읽어 Supabase posts 테이블에 삽입합니다.
 *
 * 실행 방법:
 *   npx tsx scripts/seed-posts.ts
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

// ─── 슬러그 매핑 (폴더명 → URL slug) ──────────────────────────────────────────
const SLUG_MAP: Record<string, string> = {
  declarative: "declarative",
  "window-open": "window-open",
  "why-auth": "why-auth",
  suspense: "suspense",
  nginx: "nginx",
  get_post: "get-post",
  "form은 언제 사용해야할까": "form-when-to-use",
  "12월 회고": "december-retrospective",
  "11월 회고": "november-retrospective",
  "페이지 이탈 시 API 요청": "page-unload-api",
};

// ─── 요약 매핑 ─────────────────────────────────────────────────────────────────
const EXCERPT_MAP: Record<string, string> = {
  declarative:
    "useSuspense 학습을 계기로 리액트가 권장하는 선언형 프로그래밍의 의미를 탐구했다.",
  "window-open":
    "LMS에서 Viewer 팝업이 중복으로 열리는 문제를 window.open의 name 속성과 BroadcastChannel API로 해결한 과정을 정리했다.",
  "why-auth":
    "Authorization: Bearer 방식이 현대 인증의 표준이 된 이유를 보안·아키텍처·토큰 전략 관점에서 정리했다.",
  suspense:
    "useSuspenseQuery와 Suspense, ErrorBoundary를 직접 사용하면서 선언적 비동기 처리의 장단점을 정리했다.",
  nginx:
    "Nginx의 이벤트 기반 아키텍처부터 리버스 프록시, 성능 최적화까지 프론트엔드 개발자 관점에서 정리했다.",
  get_post:
    "카카오 로그인에 GET을 사용하다 POST로 전환해야 하는 이유를 보안 취약점 관점에서 분석했다.",
  "form은 언제 사용해야할까":
    "버튼 기반 UI 작업을 계기로 form 태그의 역할과 제어형·비제어형 컴포넌트의 차이를 다시 정리했다.",
  "12월 회고":
    "1년차를 마무리하며 두 프로젝트를 통해 배운 것들과 코드 리뷰의 필요성을 돌아봤다.",
  "11월 회고":
    "v0 활용, 화면 명세서 작성, 깃허브 이슈 관리를 시도하며 배운 점들을 정리했다.",
  "페이지 이탈 시 API 요청":
    "사용자 온/오프라인 상태 감지를 위해 페이지 이탈 시 API 요청을 보내는 방법을 비교·정리했다.",
};

// ─── 프론트매터 파싱 ───────────────────────────────────────────────────────────
function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      data[key.trim()] = rest.join(":").trim().replace(/^'|'$/g, "");
    }
  }
  return { data, content: match[2] };
}

// ─── 콘텐츠 정제 ──────────────────────────────────────────────────────────────
function cleanContent(content: string): string {
  return content
    .replace(/```toc[\s\S]*?```/g, "") // ```toc 블록 제거
    .replace(/<\/aside>/g, "") // </aside> 잔여 태그 제거
    .trim();
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────
async function main() {
  const contentDir = path.resolve(process.cwd(), "content");
  const folders = fs.readdirSync(contentDir);

  const posts = [];

  for (const folder of folders) {
    const filePath = path.join(contentDir, folder, "index.md");
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const cleanedContent = cleanContent(content);
    const slug = SLUG_MAP[folder];

    if (!slug) {
      console.warn(`⚠️  슬러그 매핑 없음: ${folder}`);
      continue;
    }

    const post = {
      slug,
      title: data.title ?? folder,
      excerpt: EXCERPT_MAP[folder] ?? "",
      content: cleanedContent,
      image_url: "",
      tags: data.tags
        ? data.tags.split(",").map((t: string) => t.trim())
        : [],
      created_at: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      published: true,
    };

    posts.push(post);
    console.log(`✅ 준비: [${post.created_at.slice(0, 10)}] ${post.title}`);
  }

  console.log(`\n📤 총 ${posts.length}개 글을 Supabase에 삽입 중...`);

  const { data, error } = await supabase
    .from("posts")
    .upsert(posts, { onConflict: "slug" })
    .select("slug, title");

  if (error) {
    console.error("❌ 삽입 실패:", error.message);
    process.exit(1);
  }

  console.log(`\n🎉 완료! ${data?.length ?? 0}개 글이 등록되었어요.`);
  for (const p of data ?? []) {
    console.log(`   /post/${p.slug}  —  ${p.title}`);
  }

  console.log("\n⚠️  로컬 이미지를 포함한 글 (직접 업로드 필요):");
  console.log(
    "   - nginx          : content/nginx/nginx_flow.png",
  );
  console.log(
    "   - 12월 회고      : content/12월 회고/IMG_3959.JPG",
  );
  console.log(
    "   - 페이지 이탈    : content/페이지 이탈 시 API 요청/*.gif",
  );
}

main();
