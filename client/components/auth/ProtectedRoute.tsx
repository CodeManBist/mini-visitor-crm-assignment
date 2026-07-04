"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}