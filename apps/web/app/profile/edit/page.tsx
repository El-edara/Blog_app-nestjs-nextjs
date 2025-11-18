import EditProfileForm from "@/components/profile/EditProfileForm";
import { getProfile } from "@/lib/actions/profile.actions";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const profile = await getProfile();

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          تعديل الملف الشخصي
        </h1>
        <EditProfileForm user={profile} />
      </div>
    </div>
  );
}
