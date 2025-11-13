"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/lib/actions/auth.action";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, {});

  // ✅ استخدم useEffect عشان ميتنفذش في كل render
  useEffect(() => {
    if (state.success) {
      toast.success("Login successful 🎉");
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.success, router]); // ✅ بيتنفذ بس لما state.success يتغير

  // ✅ عرض الـ errors
  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.message, state.success]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-8">
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            // transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4  cursor-pointer select-none"
          >
            <span
              onClick={() => router.push("/")}
              className="text-white font-bold text-2xl"
            >
              B
            </span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sign In
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />
            {state.error?.email && (
              <p className="text-sm text-red-500 mt-1">
                {state.error.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />
            {state.error?.password && (
              <p className="text-sm text-red-500 mt-1">
                {state.error.password}
              </p>
            )}
          </div>

          {/* Global Error */}
          {state.message && !state.success && (
            <div className="rounded bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3">
              {state.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || state.success}
          >
            {isPending || state.success ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {state.success ? "Redirecting..." : "Signing in..."}
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
