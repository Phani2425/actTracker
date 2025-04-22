"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-28 relative">
      <div className="absolute top-22 left-6">
        <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">
            Sign in to continue to ActTracker
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignIn
            afterSignInUrl={"/auth-callback"}
            redirectUrl={"/auth-callback"}
            appearance={{
              elements: {
                card: "bg-background shadow-md",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
