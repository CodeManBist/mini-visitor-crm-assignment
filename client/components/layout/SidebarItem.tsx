"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: React.ElementType;
}

export default function SidebarItem({
  title,
  href,
  icon: Icon,
}: SidebarItemProps) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300",
        active
          ? "bg-[var(--primary)] text-white shadow-xl shadow-indigo-600/20"
          : "text-[var(--foreground)]/68 hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]"
      )}
    >

      <Icon
        size={20}
        className={cn(
          "transition-all duration-300",
          active
            ? "scale-110"
            : "group-hover:scale-110"
        )}
      />

      <span className="font-medium">{title}</span>
    </Link>
  );
}