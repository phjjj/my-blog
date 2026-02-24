"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "로그인에 실패했어요. 다시 시도해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-crimson text-xs font-bold tracking-[0.4em] mb-4 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-crimson" />
            관리자
            <span className="w-6 h-px bg-crimson" />
          </div>
          <h1 className="text-2xl font-light tracking-[0.15em] text-muted">
            데브.로그
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest text-subtle mb-2 uppercase">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-border px-4 py-3 text-sm text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest text-subtle mb-2 uppercase">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-border px-4 py-3 text-sm text-muted outline-none focus:border-crimson transition-colors placeholder:text-border"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-crimson text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-crimson text-cream text-xs font-semibold tracking-widest uppercase py-3 hover:bg-[#6a0015] transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
