"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth.action";
import { User, LogOut, Shield } from "lucide-react";
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
  const isAdmin = session?.user?.role === "ADMIN";
  const username =
    session?.user?.name || session?.user?.email?.split("@")[0] || "User";

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeMenu}
      />

      {/* Menu Content */}
      <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-1">
            {/* === Home & Posts (للكل) === */}
            <NavLink
              href="/"
              label="Home"
              pathname={pathname}
              closeMenu={closeMenu}
            />
            <NavLink
              href="/posts"
              label="Posts"
              pathname={pathname}
              closeMenu={closeMenu}
            />

            {/* === لو مسجل دخول === */}
            {session && (
              <>
                {/* Dashboard → للـ User العادي فقط */}
                {!isAdmin && (
                  <NavLink
                    href="/dashboard"
                    label="Dashboard"
                    pathname={pathname}
                    closeMenu={closeMenu}
                  />
                )}

                {/* Admin Panel → للـ Admin فقط */}
                {isAdmin && (
                  <NavLink
                    href="/admin"
                    label="Admin Panel"
                    icon={<Shield className="w-5 h-5" />}
                    pathname={pathname}
                    closeMenu={closeMenu}
                    className="text-red-600 dark:text-red-400 font-semibold"
                  />
                )}

                {/* اللينكات المشتركة */}
                <NavLink
                  href="/profile"
                  label="Profile"
                  pathname={pathname}
                  closeMenu={closeMenu}
                />
                <NavLink
                  href="/contact"
                  label="Contact"
                  pathname={pathname}
                  closeMenu={closeMenu}
                />
                <NavLink
                  href="/about"
                  label="About"
                  pathname={pathname}
                  closeMenu={closeMenu}
                />

                {/* Divider */}
                <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

                {/* User Info */}
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="px-4 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-3"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-400">
                      {username}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {session.user.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 rounded-full">
                        ADMIN
                      </span>
                    )}
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3 px-4 pt-3">
                  <form action={logoutAction} className="flex-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start gap-3"
                      onClick={closeMenu}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </form>
                  <ThemeToggler />
                </div>
              </>
            )}

            {/* === لو ضيف (غير مسجل) === */}
            {!session && (
              <>
                <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
                <div className="px-4 space-y-3">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" size="lg" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMenu}>
                    <Button size="lg" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون NavLink مُحسّن
function NavLink({
  href,
  label,
  icon,
  pathname,
  closeMenu,
  className = "",
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  pathname: string;
  closeMenu: () => void;
  className?: string;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={closeMenu}
      className={`px-4 py-3.5 text-base font-medium rounded-xl transition-all flex items-center gap-3 ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      } ${className}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
      )}
    </Link>
  );
}
