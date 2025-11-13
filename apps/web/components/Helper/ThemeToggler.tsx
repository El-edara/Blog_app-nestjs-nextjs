"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ لازم نستنى الماونت عشان نتجنب hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleThemeChange = () => {
    // ✅ نضيف class مؤقت بيعمل fade animation
    document.documentElement.classList.add("theme-transition");

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 400);

    // ✅ بدّل الـ theme فعلياً
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={handleThemeChange}
      aria-label="Toggle theme"
      className="relative h-9 w-9 rounded-full flex items-center justify-center 
                hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
    >
      <Sun
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all 
                  dark:-rotheme-traate-90 dark:scale-0"
      />
      <Moon
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all 
                    dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggler;
