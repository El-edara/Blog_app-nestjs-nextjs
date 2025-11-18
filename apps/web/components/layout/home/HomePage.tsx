"use client";

import Link from "next/link";
import styles from "../../../app/page.module.css";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Session } from "@/lib/types";

interface HomePageProps {
  session: Session | null;
}
export default function HomeClient({ session }: HomePageProps) {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Easy Writing",
      desc: "Write and publish your posts with our intuitive editor.",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Community",
      desc: "Connect with readers and writers. Comment, share, and engage.",
    },
    {
      icon: <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title: "Fast & Secure",
      desc: "Built with modern tech stack. Secure and blazing fast.",
    },
  ];
  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <section className="py-20 md:py-28 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h1
            className={`text-4xl md:text-5xl lg:text-6xl mb-6 font-bold ${styles.textGradient}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            WELCOME TO BLOGIFY
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Share your thoughts, stories, and ideas with the world. Join our
            community of writers and readers today.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 cursor-pointer">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/posts/create">
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-colors cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    Create Post
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </motion.div>

          {/* ✅ Browse Posts Button */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link href="/posts">
              <Button size="lg" variant="ghost" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Browse All Posts
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-16 border-t"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Why Choose Blogify?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl border bg-white dark:bg-gray-900 shadow-xs hover:shadow-sm transition-shadow duration-200 dark:shadow-blue-500 "
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      {!session && (
        <motion.section
          className="py-16 border-t"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`max-w-4xl mx-auto text-center rounded-2xl p-12 text-white ${styles.animationGradient}`}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.4,
              }}
            >
              Ready to Start Writing?
            </motion.h2>
            <motion.p
              className="text-lg mb-6 opacity-90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Join thousands of writers sharing their stories on Blogify.
            </motion.p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 cursor-pointer"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </div>
  );
}
