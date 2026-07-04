"use client";

import { LogOut } from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function SidebarFooter() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="border-t border-[var(--border)] p-5">

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[var(--foreground)]/68 transition-all duration-300 hover:bg-red-500/10 hover:text-red-600"
      >

        <LogOut size={20} />

        Logout

      </button>

    </div>
  );
}