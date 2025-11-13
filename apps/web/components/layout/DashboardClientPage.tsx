"use client";

import { motion } from "framer-motion";
import {
  User as UserIcon,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Profile } from "@/lib/types";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
}

interface DashboardClientPageProps {
  profile: Profile | null;
  stats?: Stats;
}

// تعريف Stats الافتراضية للتعامل مع خطأ undefined
const defaultStats: Stats = {
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalComments: 0,
};

const variants = {
  initial: { opacity: 0, scale: 0.7, rotate: -5 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  transition: {
    type: "spring",
    ease: "easeOut",
    stiffness: 400,
    damping: 17,
    duration: 0.3,
  },
};

export default function DashboardClientPage({
  profile,
  stats = defaultStats,
}: DashboardClientPageProps) {
  const currentStats = stats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Posts */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStats.totalPosts}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Posts
            </p>
          </motion.div>

          {/* Published */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Live
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStats.publishedPosts}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Published Posts
            </p>
          </motion.div>

          {/* Drafts */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Draft
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStats.draftPosts}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Draft Posts
            </p>
          </motion.div>

          {/* Comments */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStats.totalComments}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comments Received
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Posts */}
          <motion.a
            href="/dashboard/my-posts"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
              duration: 0.5,
              delay: 0.3,
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200 dark:shadow-blue-500 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Posts
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and edit your posts
                </p>
              </div>
            </div>
          </motion.a>

          {/* Profile */}
          <motion.a
            href="/profile"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
              duration: 0.3,
              delay: 0.35,
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200 dark:shadow-blue-500 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your profile
                </p>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
