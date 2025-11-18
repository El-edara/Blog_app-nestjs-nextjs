// app/admin/comments/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllCommentsAdmin } from "@/lib/actions/admin.actions";
import AdminCommentsPage from "@/components/admin/AdminCommentsPage";
import Pagination from "@/components/posts/Pagination";

export default async function AdminCommentsRoute({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 15;

  const result = await getAllCommentsAdmin(); // عدّل الـ action ده بعد شوية

  // افترض إنك عدّلت getAllCommentsAdmin() ترجع pagination meta
  const comments = result.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(result.length / limit);
  const total = result.length;
  return (
    <>
      <AdminCommentsPage comments={comments} />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          total={total}
          basePath="/admin/comments"
        />
      )}
    </>
  );
}
