"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/utils/supabase";

export default function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs font-semibold tracking-widest text-subtle hover:text-crimson transition-colors uppercase"
    >
      로그아웃
    </button>
  );
}
