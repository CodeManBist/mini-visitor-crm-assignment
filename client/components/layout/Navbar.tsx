"use client";

import * as React from "react";

import { Menu, MoonStar, SunMedium } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SearchBox from "./SearchBox";
import { useTheme } from "@/providers/ThemeProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 350);

  React.useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [pathname, searchParams]);

  React.useEffect(() => {
    const nextValue = debouncedQuery.trim();
    const currentValue = (searchParams.get("search") ?? "").trim();

    if (nextValue === currentValue) {
      return;
    }

    if (!nextValue) {
      router.replace(pathname);
      return;
    }

    router.replace(`${pathname}?search=${encodeURIComponent(nextValue)}`);
  }, [debouncedQuery, pathname, router, searchParams]);

  function handleSearch(value: string) {
    const nextValue = value.trim();

    if (!nextValue) {
      router.push(pathname);
      return;
    }

    router.replace(`${pathname}?search=${encodeURIComponent(nextValue)}`);
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[var(--border)]/80 bg-[var(--background)]/82 px-4 backdrop-blur-2xl md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition hover:bg-[var(--card-hover)] lg:hidden"
      >
        <Menu size={18} />
      </button>

      <SearchBox
        className="hidden md:block"
        placeholder="Search customers, visitors..."
        value={query}
        onValueChange={setQuery}
        onSubmit={handleSearch}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition hover:bg-[var(--card-hover)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
        </button>
      </div>
    </header>
  );
}