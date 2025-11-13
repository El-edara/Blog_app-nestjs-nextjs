import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Blogify - Modern Blogging Platform",
  description:
    "A full-stack blogging platform built with Next.js 15, NestJS, and PostgreSQL",
  keywords: ["blog", "nextjs", "nestjs", "postgresql", "typescript"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    title: "Blogify - Modern Blogging Platform",
    description: "Share your thoughts with the world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* ✅ Navbar - Server Component */}
          <Navbar />

          {/* ✅ Main Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          {/* ✅ Footer (optional) */}
          <Footer />
          {/* ✅ Toast Notifications */}
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
