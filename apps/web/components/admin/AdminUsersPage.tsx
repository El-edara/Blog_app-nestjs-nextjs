"use client";

import {
  deleteUserAdmin,
  updateUserRoleAdmin,
} from "@/lib/actions/admin.actions";
import { motion } from "framer-motion";
import {
  User,
  Trash2,
  Shield,
  ShieldOff,
  Mail,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "../../app/page.module.css";
import { toast } from "sonner";

interface UserData {
  id: number;
  name?: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

interface AdminUsersPageProps {
  users: UserData[];
}

export default function AdminUsersPage({
  users: initialUsers,
}: AdminUsersPageProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<number | null>(null);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(userId);
    try {
      const result = await deleteUserAdmin(userId);
      if (!result.success) throw new Error(result.message);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleRole = async (userId: number, currentRole: string) => {
    setLoading(userId);
    try {
      const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      const result = await updateUserRoleAdmin(userId, newRole);
      if (!result.success) throw new Error(result.message);

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole as "USER" | "ADMIN" } : u
        )
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold ${styles.textGradient} mb-2`}>
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total Users: {users.length}
          </p>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Panel</span>
        </motion.a>

        {/* Users Table */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.[0]?.toUpperCase() ||
                            user.email[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name || "No name"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {user.role}
                      </span>
                    </td>

                    {/* Activity */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>{user._count?.posts || 0} posts</p>
                        <p>{user._count?.comments || 0} comments</p>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Role */}
                        <button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          disabled={loading === user.id}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title={`Make ${user.role === "ADMIN" ? "User" : "Admin"}`}
                        >
                          {user.role === "ADMIN" ? (
                            <ShieldOff className="w-4 h-4" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={loading === user.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
