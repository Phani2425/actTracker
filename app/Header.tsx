"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { motion } from "framer-motion";
import { BarChart3, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b transition-all duration-200",
        isHomePage 
          ? "border-transparent bg-background/60" 
          : "bg-background/90 border-border/40 dark:border-border/20"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={"/"} className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 rounded-md bg-black/10 dark:bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" className="text-black dark:text-white" />
                <motion.path 
                  d="M7 10.5h3v3H7v-3zM14 10.5h3v3h-3v-3zM7 17h3v3H7v-3zM14 17h3v3h-3v-3zM7 4h3v3H7V4zM14 4h3v3h-3V4z" 
                  fill="currentColor" 
                  className="text-black/70 dark:text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-foreground">actTracker</span>
            <span className="text-xs -mt-1 text-muted-foreground hidden sm:block">Track your uploads</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground"
              >
                Sign in
              </Button>
            </SignInButton>
            
            <div className="hidden sm:block">
              <ModeToggle />
            </div>
          </Unauthenticated>
          
          <Authenticated>
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              
              <Link href="/analytics">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <ModeToggle />
              <div className="flex justify-center items-center h-9 w-9 overflow-hidden rounded-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-background shadow-sm">
                <UserButton />
              </div>
            </div>
          </Authenticated>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
