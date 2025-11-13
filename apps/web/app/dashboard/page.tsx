import { getSession } from "@/lib/session";
import { getProfile } from "@/lib/actions/profile.actions";
import { getMyPosts } from "@/lib/actions/posts.actions";
import { redirect } from "next/navigation";
import DashboardClientPage from "@/components/layout/DashboardClientPage";

export const dynamic = "force-dynamic";

// تعيين إعادة التحقق المجدولة (Cache Revalidation)
export const revalidate = 300;

const DashboardPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // 2. جلب البيانات (Server Only)
  const [profile, posts] = await Promise.all([getProfile(), getMyPosts()]);

  // 3. حساب الإحصائيات (Server Only)
  const stats = {
    totalPosts: posts?.length ?? 0,
    publishedPosts: posts?.filter((p) => p.published).length ?? 0,
    draftPosts: posts?.filter((p) => !p.published).length ?? 0,
    totalComments:
      posts?.reduce((sum, p) => sum + (p._count?.comments ?? 0), 0) ?? 0,
  };

  // 4. عرض المكون العميل وتمرير البيانات المحسوبة
  return <DashboardClientPage profile={profile} stats={stats} />;
};

export default DashboardPage;
