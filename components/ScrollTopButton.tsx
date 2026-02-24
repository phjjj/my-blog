"use client";

export default function ScrollTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="hover:text-crimson transition-colors"
    >
      TOP ↑
    </button>
  );
}
