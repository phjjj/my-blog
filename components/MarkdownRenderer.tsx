"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-normal text-muted mt-16 mb-6 border-b border-border pb-4 leading-snug">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-normal text-muted mt-12 mb-4 leading-snug">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-medium text-muted mt-8 mb-3">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-6 leading-[1.9] break-keep">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-crimson pl-6 my-10 italic text-subtle text-lg leading-relaxed">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <div className="my-10 bg-paper border border-border rounded-sm overflow-hidden">
      <div className="flex gap-2 px-4 py-3 border-b border-border/50">
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
      </div>
      <pre className="p-6 overflow-x-auto text-sm font-mono text-[#555555] leading-relaxed">
        {children}
      </pre>
    </div>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-paper px-1.5 py-0.5 rounded-sm text-sm font-mono text-[#555555]"
          {...props}
        >
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
      className="text-crimson underline underline-offset-2 hover:opacity-75 transition-opacity"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-6 space-y-1.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-1.5">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-[1.8] text-muted">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#555555]">{children}</strong>
  ),
  hr: () => <hr className="border-t border-border my-12" />,
};

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-muted text-base md:text-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
