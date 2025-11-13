"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { registerAction } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, {});

  // ✅ Handle success - بيتنفذ مرة واحدة بس
  useEffect(() => {
    if (state.success) {
      toast.success("Account created successfully! 🎉");

      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);

      // ✅ Cleanup عشان لو الـ component unmount
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  // ✅ Handle error - بيتنفذ مرة واحدة بس
  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.message, state.success]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
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
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join us today and start your journey
          </p>
        </div>

        {/* ✅ Success Banner */}
        {state.success && (
          <div className="mb-4 flex items-center gap-2 rounded bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>Account created! Redirecting to login...</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              disabled={isPending || state.success}
            />
            {state.error?.name && (
              <p className="text-sm text-red-500 mt-1">{state.error.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending || state.success}
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
              disabled={isPending || state.success}
            />
            {state.error?.password && (
              <p className="text-sm text-red-500 mt-1">
                {state.error.password[0]}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending || state.success}
            />
            {state.error?.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {state.error.confirmPassword[0]}
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
            {state.success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Success! Redirecting...
              </>
            ) : isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
