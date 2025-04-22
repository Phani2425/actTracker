"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import logo from "../public/2ndBrain-photoaidcom-cropped.png";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2 fixed inset-x-0 top-0 shadow-2xl z-20 bg-white dark:bg-black ">
      <Link href={"/"} className="flex items-center gap-3">
        <Image className="w-11 h-11 cursor-pointer  " src={logo} alt="logo" />
        <h1 className="font-extrabold text-xl">actTracker</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <div className="flex justify-center items-center p-1 bg-gray-500/30 rounded-full">
            <UserButton />
          </div>
          <ModeToggle />
        </Authenticated>
      </div>
    </div>
  );
};

export default Header;
