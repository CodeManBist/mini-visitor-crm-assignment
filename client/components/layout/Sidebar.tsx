"use client";

import { X } from "lucide-react";

import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { SIDEBAR_ITEMS } from "@/constants/router";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={
          open
            ? "fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
            : "pointer-events-none fixed inset-0 z-40 bg-black/0 lg:hidden"
        }
        onClick={onClose}
      />

      <aside
        className={
          open
            ? "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[var(--border)] bg-[var(--card)]/98 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0"
            : "fixed left-0 top-0 z-50 flex h-screen w-72 -translate-x-full flex-col border-r border-[var(--border)] bg-[var(--card)]/98 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0"
        }
      >

        <div className="flex items-start justify-between border-b border-[var(--border)]/80 bg-[var(--background)]/25 p-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Mini CRM</h1>
            <p className="mt-2 text-sm text-[var(--foreground)]/55">Visitor Management</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] text-[var(--foreground)]/70 transition hover:text-[var(--foreground)] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4 py-5">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
            />
          ))}
        </nav>

        <SidebarFooter />
      </aside>
    </>
  );
}