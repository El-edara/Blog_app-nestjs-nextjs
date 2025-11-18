// components/layout/NavbarClient.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth.action";
import ThemeToggler from "../Helper/ThemeToggler";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Session } from "@/lib/types";
import MobileNav from "./MobileNav";

interface NavbarClientProps {
  session: Session | null;
}

export function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = ["/login", "/register"].includes(pathname);
  if (isAuthPage) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors duration-200 ${
      pathname === path
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
    }`;

  const username =
    session?.user?.name || session?.user?.email?.split("@")[0] || "User";

  const isAdmin = session?.user.role === "ADMIN";
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-bold text-xl shrink-0">
              <span
                className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
              mr-2"
              >
                Blogify
              </span>
            </Link>

            {/* ✅ Desktop Menu */}
            <div className="hidden md:flex items-center gap-4 overflow-x-auto scrollbar-hide whitespace-nowrap p-2">
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
              <Link href="/posts" className={linkClass("/posts")}>
                Posts
              </Link>

              {/* Dashboard → للـ user العادي فقط */}
              {session && !isAdmin && (
                <Link href="/dashboard" className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
              )}

              {/* Admin → للـ admin فقط */}
              {session && isAdmin && (
                <Link href="/admin" className={linkClass("/admin")}>
                  <span className="flex items-center gap-1">
                    Admin Dashboard
                    <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">
                      !
                    </span>
                  </span>
                </Link>
              )}

              {/* اللينكات المشتركة */}
              {session && (
                <>
                  <Link href="/profile" className={linkClass("/profile")}>
                    Profile
                  </Link>
                  <Link href="/contact" className={linkClass("/contact")}>
                    Contact
                  </Link>
                  <Link href="/about" className={linkClass("/about")}>
                    About
                  </Link>
                </>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggler />

              {session ? (
                // ✅ Logged in state
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <div className="w-max flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {username}
                      </span>
                    </div>
                  </Link>
                  <form action={logoutAction}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </form>
                </div>
              ) : (
                // ✅ Guest state
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggler />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="h-9 w-9"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Navigation */}
      {isMenuOpen && (
        <MobileNav
          session={session}
          pathname={pathname}
          closeMenu={closeMenu}
        />
      )}
    </>
  );
}
