"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Menu } from "lucide-react"; 

const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden p-4 flex justify-between items-center bg-[#121212] shadow-md ">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/assets/images/logo.png"
          alt="logo"
          width={140}
          height={28}
        />
      </Link>

      {/* Hamburger Menu Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="text-gray-300 hover:text-red-700 cursor-pointer transition d"
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="bg-[#121212] text-gray-300 w-62 p-6 flex flex-col justify-between"
        >
          {/* Header */}
          <SheetHeader>
            <SheetTitle>
            <Link href="/" className="flex items-center mb-8">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={150}
            height={30}
            priority
          />
        </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Navigation */}
          <nav>
          <SignedIn>
            <ul className="flex flex-col gap-3">
              {/* First 6 links */}
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg hover:scale-110"
                        : "text-gray-300 hover:bg-[#1E1E1E] hover:text-red-400 hover:scale-110"
                    }`}
                  >
                    <Link
                      href={link.route}
                      className="flex flex-row items-center gap-2"
                    >
                      <Image
                        src={link.icon}
                        alt="icon"
                        width={22}
                        height={22}
                        className="opacity-80"
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <hr className="border-gray-700 my-4" />

              {/* Remaining links */}
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg"
                        : "text-gray-300 hover:bg-[#1E1E1E] hover:text-red-400 hover:scale-110"
                    }`}
                  >
                    <Link
                      href={link.route}
                      className="flex flex-row items-center gap-2"
                    >
                      <Image
                        src={link.icon}
                        alt="icon"
                        width={22}
                        height={22}
                        className="opacity-80"
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              {/* User Profile */}
              <li className="mt-6 flex items-center gap-3 p-2 rounded-lg bg-[#1E1E1E] hover:bg-[#272727] transition">
                <UserButton showName />
              </li>
            </ul>
          </SignedIn>

          {/* Login Button for Signed Out */}
          <SignedOut>
            <div className="mt-6">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full rounded-lg"
              >
                <Link href={"/sign-in"}>Login</Link>
              </Button>
            </div>
          </SignedOut>
        </nav>

        {/* Footer */}
        <div className="text-gray-500 text-xs mt-10 text-center">
          © {new Date().getFullYear()} YourApp
        </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNav;
