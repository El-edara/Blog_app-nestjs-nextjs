"use client";

import { motion } from "framer-motion";
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  Eye,
} from "lucide-react";
import Link from "next/link";
import styles from "../../app/page.module.css";
import { Post, User } from "@/lib/types";

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  publishedPosts: number;
}

interface AdminActivity {
  recentUsers: User[];
  recentPosts: Post[];
}

interface AdminDashboardProps {
  stats: AdminStats;
  activity: AdminActivity;
}

export default function AdminDashboard({
  stats,
  activity,
}: AdminDashboardProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-400 to-blue-700",
      darkBorderColor: "dark:border-b-blue-500",
      link: "/admin/users",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: <FileText className="w-8 h-8" />,
      color: "from-purple-400 to-purple-700",
      darkBorderColor: "dark:border-b-purple-500",
      link: "/admin/posts",
    },
    {
      title: "Published Posts",
      value: stats.publishedPosts,
      icon: <Eye className="w-8 h-8" />,
      color: "from-green-400 to-green-700",
      darkBorderColor: "dark:border-b-green-500",
      link: "/admin/posts",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-orange-400 to-orange-700",
      darkBorderColor: "dark:border-b-orange-500",
      link: "/admin/comments",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all registered users",
      icon: <Users className="w-6 h-6" />,
      link: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Manage Posts",
      description: "Review, edit, or delete posts",
      icon: <FileText className="w-6 h-6" />,
      link: "/admin/posts",
      color: "bg-purple-500",
    },
    {
      title: "Manage Comments",
      description: "Moderate user comments",
      icon: <MessageSquare className="w-6 h-6" />,
      link: "/admin/comments",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className={`text-4xl font-bold ${styles.textGradient}`}>
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your platform from one place
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <Link href={card.link}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-none dark:border-t-0 dark:border-l-0 dark:border-r-0 dark:border-b-2 ${card.darkBorderColor}`}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${card.color} opacity-70`}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-linear-to-br ${card.color} text-white`}
                    >
                      {card.icon}
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>

                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link}>
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-xs hover:shadow-md transition-shadow duration-200 dark:shadow-blue-500/80 cursor-pointer"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div
                    className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          {activity ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Recent Activity <span>(Last 7 days)</span>
              </h2>

              {/* Recent Users */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Recent Users
                </h3>
                <div className="space-y-2">
                  {activity.recentUsers.length > 0 ? (
                    activity.recentUsers.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <div>
                          <p className="font-medium">
                            {user.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {user.role}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent users</p>
                  )}
                </div>
              </div>

              {/* Recent Posts */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Recent Posts
                </h3>
                <div className="space-y-2">
                  {activity.recentPosts.length > 0 ? (
                    activity.recentPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {post.author.name || post.author.email}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            post.published
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent posts</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <p className="text-gray-600 dark:text-gray-400">
                No recent activity available.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
