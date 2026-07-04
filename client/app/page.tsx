"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [hydrated, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader className="h-8 w-8" />
    </div>
  );
}