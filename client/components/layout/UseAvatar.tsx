"use client";

import { ChevronDown } from "lucide-react";

export default function UserAvatar() {
  return (
    <button className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 transition-all duration-300 hover:bg-[var(--card-hover)]">

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white">

        A

      </div>

      <div className="text-left">

        <p className="text-sm font-semibold text-[var(--foreground)]">

          Admin

        </p>

        <p className="text-xs text-[var(--foreground)]/55">

          admin@crm.com

        </p>

      </div>

      <ChevronDown
        size={18}
        className="text-[var(--foreground)]/55"
      />

    </button>
  );
}