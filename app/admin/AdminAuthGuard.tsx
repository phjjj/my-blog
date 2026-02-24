"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/utils/supabase";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    getSession()
      .then((session) => {
        setAuthStatus(session ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        setAuthStatus("unauthenticated");
      });
  }, [isLoginPage]);

  useEffect(() => {
    if (authStatus === "unauthenticated" && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [authStatus, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-subtle tracking-widest">확인 중...</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
