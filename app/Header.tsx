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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-28 relative">
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
        <Button asChild variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 cursor-pointer h-8 sm:h-9">
          <Link href="/">
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Back to Home</span>
          </Link>
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[90%] sm:max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Sign In</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
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
