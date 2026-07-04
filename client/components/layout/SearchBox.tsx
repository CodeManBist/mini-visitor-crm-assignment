"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export default function SearchBox({
  className,
  placeholder = "Search...",
  value,
  onValueChange,
  onSubmit,
}: SearchBoxProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value.trim());
  }

  return (
    <form className={cn("relative w-full max-w-[380px]", className)} onSubmit={handleSubmit}>

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/55"
      />

      <input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] pl-11 pr-14 text-sm text-[var(--foreground)] outline-none transition-all duration-300 placeholder:text-[var(--foreground)]/45 focus:border-[var(--primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--primary),transparent_85%)]"
      />

      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--foreground)]/55 transition hover:border-[var(--primary)] hover:text-[var(--foreground)]"
      >

        Enter

      </button>

    </form>
  );
}