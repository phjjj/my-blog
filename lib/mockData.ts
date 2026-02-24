import type { Post } from "@/types/post";

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    slug: "understanding-rsc-2026",
    title: "2026년, 리액트 서버 컴포넌트(RSC) 이해하기",
    excerpt:
      "서버 컴포넌트가 상태 관리, 데이터 페칭, 그리고 번들 사이즈를 대하는 방식을 어떻게 변화시키는지 깊이 파헤쳐 봅니다. 무거운 클라이언트 사이드 자바스크립트와 작별하세요.",
    image_url:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800&h=450",
    tags: [],
    created_at: "2026-02-24T00:00:00.000Z",
    published: true,
    content: `리액트(React) 생태계는 끊임없이 진화하고 있습니다. 클라이언트 사이드 렌더링(CSR)의 한계를 극복하기 위해 등장한 서버 컴포넌트(React Server Components, RSC)는 이제 선택이 아닌 필수가 되어가고 있습니다. 이 글에서는 RSC가 우리의 사고방식을 어떻게 바꾸고 있는지 정리해 봅니다.

## 패러다임의 전환

기존의 리액트 애플리케이션은 기본적으로 모든 컴포넌트의 자바스크립트 코드를 클라이언트로 전송해야 했습니다. 이는 초기 로딩 속도 저하와 불필요한 네트워크 대역폭 낭비로 이어졌죠.

> "서버 컴포넌트는 서버의 인프라스트럭처를 리액트의 트리 안으로 직접 가져옵니다. 클라이언트 번들 사이즈에는 단 1바이트도 추가하지 않으면서요."

RSC를 사용하면 데이터베이스 쿼리나 파일 시스템 접근 같은 무거운 작업을 서버에서 수행하고, 오직 렌더링된 UI의 결과물(직렬화된 형태)만 클라이언트로 전달할 수 있습니다.

### 데이터 페칭의 단순화

이제 \`useEffect\`와 \`useState\`를 사용해 로딩 상태를 관리하며 데이터를 가져올 필요가 없습니다. 서버 컴포넌트는 기본적으로 비동기(async) 함수로 작성될 수 있기 때문입니다.

\`\`\`tsx
// app/page.tsx (Server Component)
import db from '@/lib/db';

export default async function BlogPost({ params }) {
  // 클라이언트로 전송되지 않는 서버 측 코드
  const post = await db.query.getPost(params.id);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

위 코드에서 볼 수 있듯, 브라우저로 전송되는 자바스크립트는 없습니다. 데이터베이스 라이브러리(\`db\`) 역시 클라이언트 번들에 포함되지 않아 극적인 성능 향상을 이룰 수 있습니다.

## 결론

서버 컴포넌트는 만병통치약이 아닙니다. 여전히 상호작용이 필요한 곳(버튼 클릭, 폼 입력 등)에서는 \`"use client"\` 지시어를 통해 클라이언트 컴포넌트를 적절히 섞어 써야 합니다. 하지만 기본값을 '서버'로 둔다는 철학은 웹 개발의 미래를 더욱 가볍고 빠르게 만들고 있습니다.`,
  },
  {
    id: "2",
    slug: "modern-css-grid-workflow",
    title: "모던 CSS 그리드 워크플로우의 마법",
    excerpt:
      "왜 아직도 모든 곳에 flexbox만 사용하고 계신가요? 억지스러운 마진(margin) 없이 순수 CSS 그리드와 서브그리드 속성만으로 복잡한 비대칭 레이아웃을 구현하는 방법을 탐구합니다.",
    image_url:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800&h=450",
    tags: [],
    created_at: "2026-02-18T00:00:00.000Z",
    published: true,
    content: `CSS Grid는 2017년에 대부분의 브라우저에 도입되었지만, 많은 개발자들이 여전히 모든 레이아웃을 Flexbox로 해결하려 합니다. Grid가 빛을 발하는 순간은 언제인지, 그리고 Subgrid라는 게임 체인저에 대해 이야기합니다.

## Grid vs Flexbox: 선택의 기준

Flexbox는 **단일 축(1D)** 레이아웃에 최적화되어 있습니다. 수평 또는 수직 방향으로 요소를 정렬할 때 탁월합니다. 반면 Grid는 **2차원(2D)** 레이아웃, 즉 행과 열을 동시에 제어해야 할 때 진가를 발휘합니다.

> "레이아웃 컨테이너가 필요하다면 Grid, 콘텐츠 배치가 필요하다면 Flexbox를 쓰세요."

## Subgrid의 등장

\`subgrid\` 키워드는 자식 요소가 부모의 그리드 트랙을 공유할 수 있게 해줍니다.

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 2rem;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* 부모의 row 트랙 공유 */
}
\`\`\`

이를 통해 카드 컴포넌트의 제목, 본문, 버튼이 항상 같은 행에 정렬되는 마법 같은 레이아웃을 별도의 JavaScript 없이 구현할 수 있습니다.

## 결론

CSS Grid와 Subgrid를 활용하면 복잡한 편집 디자인도 깔끔하고 유지보수하기 쉬운 코드로 구현할 수 있습니다.`,
  },
  {
    id: "3",
    slug: "minimalist-api-with-go-fiber",
    title: "Go와 Fiber를 활용한 미니멀리스트 API 구축기",
    excerpt:
      "무거운 프레임워크에서 한 걸음 물러나기. Go 언어의 Fiber 프레임워크를 사용하여 200줄 미만의 코드로 번개처럼 빠르고 동시성이 높은 마이크로서비스를 구축한 방법을 소개합니다.",
    image_url:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad8?auto=format&fit=crop&q=80&w=800&h=450",
    tags: [],
    created_at: "2026-01-30T00:00:00.000Z",
    published: true,
    content: `Node.js와 Express를 벗어나 Go를 선택한 건 단순한 호기심에서 시작되었습니다. 하지만 결과는 놀라웠습니다. 200줄의 코드로 수천 건의 동시 요청을 처리하는 API가 탄생했습니다.

## 왜 Go인가?

Go는 컴파일 언어이지만 개발 속도는 인터프리터 언어에 가깝습니다. 내장된 goroutine 덕분에 동시성 처리가 매우 자연스럽고, 메모리 사용량은 Node.js의 1/10에 불과합니다.

## Fiber 소개

Fiber는 Go의 \`fasthttp\` 패키지를 기반으로 한 웹 프레임워크로, Express.js에서 영감을 받아 설계되었습니다.

\`\`\`go
package main

import (
  "github.com/gofiber/fiber/v2"
  "log"
)

func main() {
  app := fiber.New()

  app.Get("/posts", func(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
      "posts": getPosts(),
    })
  })

  log.Fatal(app.Listen(":3000"))
}
\`\`\`

## 결론

Go와 Fiber의 조합은 프론트엔드 개발자도 쉽게 고성능 백엔드를 구축할 수 있게 해줍니다. 특히 마이크로서비스 아키텍처에서 빛을 발합니다.`,
  },
  {
    id: "4",
    slug: "terminal-workflow-neovim-tmux",
    title: "나의 터미널 워크플로우: Neovim과 Tmux",
    excerpt:
      "마우스는 필요 없습니다. 현재 제가 사용 중인 터미널 중심의 개발 환경, dotfiles, 그리고 없어서는 안 될 커스텀 플러그인들을 완벽하게 안내합니다.",
    image_url:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800&h=450",
    tags: [],
    created_at: "2025-12-12T00:00:00.000Z",
    published: true,
    content: `VS Code를 사용하다 Neovim으로 전향한 지 1년이 지났습니다. 처음 2주는 고통스러웠지만, 지금은 마우스 없이 더 빠르게 코드를 작성하고 있습니다.

## 왜 Neovim인가?

- **속도**: VS Code 대비 메모리 사용량 1/20
- **키보드 중심**: 손이 키보드에서 떠나지 않는 플로우 상태
- **무한한 커스텀**: 모든 것을 내 방식으로

## 핵심 플러그인 스택

\`\`\`lua
-- lazy.nvim으로 플러그인 관리
require("lazy").setup({
  -- LSP 설정
  { "neovim/nvim-lspconfig" },
  -- 파일 탐색
  { "nvim-telescope/telescope.nvim" },
  -- 자동 완성
  { "hrsh7th/nvim-cmp" },
  -- 문법 강조
  { "nvim-treesitter/nvim-treesitter" },
})
\`\`\`

## Tmux: 터미널 멀티플렉서

Tmux를 사용하면 하나의 터미널 창에서 여러 세션과 패널을 관리할 수 있습니다.

> "Tmux + Neovim 조합은 마치 IDE를 터미널 안에 넣은 것 같습니다."

## 결론

이 워크플로우는 모든 사람에게 맞지 않습니다. 하지만 키보드 중심 개발에 관심이 있다면 한번 도전해보세요. 처음의 고통은 분명 보상받을 것입니다.`,
  },
];
