"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const redirectPath =
          localStorage.getItem("redirectAfterLogin") || "/dashboard";
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
