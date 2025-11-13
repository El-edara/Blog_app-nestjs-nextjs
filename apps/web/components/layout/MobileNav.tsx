"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth.action";
import { User, LogOut } from "lucide-react";
import { Session } from "@/lib/types";
import ThemeToggler from "../Helper/ThemeToggler";

interface MobileNavProps {
  session: Session | null;
  pathname: string;
  closeMenu: () => void;
}

export default function MobileNav({
  session,
  pathname,
  closeMenu,
}: MobileNavProps) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeMenu}
      />

      {/* Menu Content */}
      <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col space-y-3">
            {/* Home */}
            <NavLink
              href="/"
              label="Home"
              pathname={pathname}
              closeMenu={closeMenu}
            />

            {/* ✅ Posts (للكل) */}
            <NavLink
              href="/posts"
              label="Posts"
              pathname={pathname}
              closeMenu={closeMenu}
            />

            {/* Dashboard */}
            {session && (
              <NavLink
                href="/dashboard"
                label="Dashboard"
                pathname={pathname}
                closeMenu={closeMenu}
              />
            )}

            {/* Profile */}
            {session && (
              <NavLink
                href="/profile"
                label="Profile"
                pathname={pathname}
                closeMenu={closeMenu}
              />
            )}

            {/* Contact */}
            {session && (
              <NavLink
                href="/contact"
                label="Contact"
                pathname={pathname}
                closeMenu={closeMenu}
              />
            )}

            {/* About */}
            {session && (
              <NavLink
                href="/about"
                label="About"
                pathname={pathname}
                closeMenu={closeMenu}
              />
            )}

            {session ? (
              <>
                {/* User Info */}
                <Link
                  href="/profile"
                  className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Logout */}
                <div className="flex justify-center items-center gap-4">
                  <form action={logoutAction} className="px-4 flex-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={closeMenu}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </form>
                  <ThemeToggler />
                </div>
              </>
            ) : (
              // Guest
              <div className="px-4 space-y-2">
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  pathname,
  closeMenu,
}: {
  href: string;
  label: string;
  pathname: string;
  closeMenu: () => void;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={closeMenu}
      className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </Link>
  );
}
