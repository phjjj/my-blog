"use client";

import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function extractHeadings(content: string): Heading[] {
  const stripped = content.replace(/```[\s\S]*?```/g, "");
  const headings: Heading[] = [];
  const idCount: Record<string, number> = {};
  for (const line of stripped.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim();
    const base = slugify(text);
    const count = idCount[base] ?? 0;
    const id = count === 0 ? base : `${base}-${count}`;
    idCount[base] = count + 1;
    headings.push({ id, text, level });
  }
  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    // max-w-4xl = 896px → 절반 448px. TOC 너비 176px + 간격 24px = 200px
    // 뷰포트 중앙에서 오른쪽으로 448px + 24px = 472px 지점에 고정
    <aside
      className="hidden xl:block fixed top-32 z-30 w-44"
      style={{ left: "calc(50% + 472px)" }}
    >
      <nav>
        <p className="text-[10px] font-bold tracking-[0.3em] text-subtle uppercase mb-4">
          목차
        </p>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{ paddingLeft: level === 1 ? 0 : level === 2 ? "0.75rem" : "1.5rem" }}
                className={`block text-[11px] leading-snug tracking-wide transition-colors truncate
                  ${activeId === id ? "text-crimson font-semibold" : "text-subtle hover:text-muted"}`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
