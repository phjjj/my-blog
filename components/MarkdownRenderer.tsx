"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-muted mt-16 mb-8 leading-[1.2] break-keep">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[1.9rem] md:text-[2.1rem] font-semibold tracking-tight text-muted mt-16 mb-6 leading-[1.3] break-keep">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[1.45rem] md:text-[1.6rem] font-semibold text-muted mt-12 mb-4 leading-[1.35] break-keep">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-[1.15rem] font-semibold text-muted mt-8 mb-3 leading-[1.45] break-keep">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-8 leading-[1.95] tracking-[0.005em] text-muted break-keep">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-crimson/80 pl-6 pr-2 my-12 text-muted/90 text-[1.05em] leading-[1.9]">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <div className="my-12 bg-paper/80 border border-border/70 rounded-md overflow-hidden">
      <div className="flex gap-2 px-4 py-3 border-b border-border/40">
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
      </div>
      <pre className="p-6 overflow-x-auto text-[0.92rem] font-mono text-[#4f4f49] leading-[1.75]">{children}</pre>
    </div>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-paper/90 border border-border/50 px-1.5 py-0.5 rounded text-[0.88em] font-mono text-[#4f4f49]"
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
      className="text-crimson underline decoration-crimson/55 underline-offset-4 hover:decoration-crimson transition-colors">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-7 mb-8 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-7 mb-8 space-y-2">{children}</ol>,
  li: ({ children }) => <li className="leading-[1.9] text-muted">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-muted">{children}</strong>,
  em: ({ children }) => <em className="italic text-[#5a5a54]">{children}</em>,
  hr: () => <hr className="border-t border-border my-12" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-12">
      <table className="w-full text-[0.95rem] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
  th: ({ children }) => (
    <th className="text-left px-4 py-2.5 text-xs font-semibold tracking-wider text-subtle bg-paper whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-2.5 text-muted leading-relaxed align-top">{children}</td>,
};

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-muted text-[1.06rem] md:text-[1.13rem]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
