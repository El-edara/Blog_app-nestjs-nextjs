import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminStats, getRecentActivity } from "@/lib/actions/admin.actions";

export const metadata = {
  title: "Admin Dashboard - Blogify",
  description: "Manage your platform",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getRecentActivity(),
  ]);

  return <AdminDashboard stats={stats} activity={activity} />;
}
