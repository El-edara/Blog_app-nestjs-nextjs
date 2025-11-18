import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminUsersPage from "@/components/admin/AdminUsersPage";
import { getAllUsersAdmin } from "@/lib/actions/admin.actions";

export default async function AdminUsersRoute() {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await getAllUsersAdmin();

  return <AdminUsersPage users={users} />;
}
