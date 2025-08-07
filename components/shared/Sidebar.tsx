"use client";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 bg-black p-6 shadow-md shadow-black/50 lg:flex flex-col justify-between">
      <div>
        {/* Logo */}
        <Link href="/" className="flex items-center mb-10">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={160}
            height={30}
            priority
            className="ml-3 hover:scale-105 transition-transform"
          />
        </Link>

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
      </div>

      {/* Footer */}
      <div className="text-gray-500 text-xs mt-10 text-center">
        © {new Date().getFullYear()} Smartcut AI
      </div>
    </aside>
  );
};

export default Sidebar;
