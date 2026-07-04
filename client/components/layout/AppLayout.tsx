"use client";

import * as React from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}