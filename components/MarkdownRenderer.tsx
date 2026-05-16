"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

function headingId(children: React.ReactNode): string {
  const text = typeof children === "string" ? children : String(children ?? "");
  return text
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

const components: Components = {
  h1: ({ children }) => (
    <h1 id={headingId(children)} className="text-[2em] font-semibold text-muted mt-8 mb-4 leading-tight pb-2 border-b border-border break-keep scroll-mt-24">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 id={headingId(children)} className="text-[1.5em] font-semibold text-muted mt-8 mb-4 leading-[1.3] pb-2 border-b border-border break-keep scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="text-[1.25em] font-semibold text-muted mt-8 mb-3 leading-[1.35] break-keep scroll-mt-24">
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 id={headingId(children)} className="text-[1em] font-semibold text-muted mt-6 mb-3 leading-[1.45] break-keep scroll-mt-24">{children}</h4>,
  p: ({ children }) => <p className="my-0 mb-4 leading-[1.7] text-muted break-keep">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-crimson/40 text-subtle">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-4 p-4 overflow-x-auto text-[85%] font-mono leading-[1.45] text-muted bg-paper rounded-md border border-border">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1 py-[0.12em] text-[85%] font-mono text-muted bg-paper rounded-sm border border-border/70"
          {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-crimson no-underline hover:underline underline-offset-2">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-8 my-0 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-8 my-0 mb-4">{children}</ol>,
  li: ({ children }) => <li className="text-muted leading-[1.7]">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-muted">{children}</strong>,
  em: ({ children }) => <em className="italic text-muted">{children}</em>,
  hr: () => <hr className="h-[0.2em] p-0 my-6 bg-border border-0" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-[0.95rem] border-collapse border border-border">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-t border-border">{children}</tr>,
  th: ({ children }) => (
    <th className="text-left px-3 py-[6px] font-semibold text-muted border border-border bg-paper whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-3 py-[6px] text-muted leading-[1.45] align-top border border-border">{children}</td>,
};

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-muted text-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
