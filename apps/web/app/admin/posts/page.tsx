import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminPostsPage from "@/components/admin/AdminPostsPage";
import { getAllPostsAdmin } from "@/lib/actions/admin.actions";

export default async function AdminPostsRoute() {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const posts = await getAllPostsAdmin();

  return <AdminPostsPage posts={posts} />;
}
