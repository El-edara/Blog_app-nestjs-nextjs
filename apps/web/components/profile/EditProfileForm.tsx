"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileClient } from "@/lib/actions/profile.client";
import type { User } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = { user: User | null };

type UpdateState = {
  success: boolean;
  status?: number;
  error?: any;
  data?: any;
} | null;

export default function EditProfileForm({ user }: Props) {
  const router = useRouter();

  const updateProfileAction = async (
    _prevState: UpdateState,
    formData: FormData
  ) => {
    // تأكد من إضافة الحقول النصية إلى FormData
    if (!formData.get("name") && user?.name) {
      formData.append("name", user.name);
    }
    return await updateProfileClient(formData);
  };

  const [state, action, isPending] = useActionState<UpdateState, FormData>(
    updateProfileAction,
    null
  );

  // ✅ بعد نجاح التحديث → نعيد التوجيه للـ profile
  useEffect(() => {
    if (state?.success) {
      toast.success("✅ تم تحديث الملف الشخصي بنجاح");
      setTimeout(() => router.push("/profile"), 500);
    } else if (state?.error) {
      toast.error(
        typeof state.error === "string" ? state.error : "❌ حدث خطأ أثناء الحفظ"
      );
    }
  }, [state, router]);

  return (
    <>
      <Link
        href="/profile"
        className="inline-flex text-sm items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to profile</span>
      </Link>
      <form
        action={action}
        className="space-y-6 bg-white/80 dark:bg-slate-900/70 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 max-w-lg mx-auto"
      >
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
          تعديل الملف الشخصي
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              البريد الإلكتروني
            </span>
            <input
              name="email"
              defaultValue={user?.email ?? ""}
              disabled
              className="mt-1 block w-full rounded-md border border-slate-300 bg-slate-100
              px-3 py-2 text-slate-600 dark:border-slate-700 dark:bg-slate-800
              dark:text-slate-400 cursor-not-allowed"
            />
          </label>

          {/* Name */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              الاسم
            </span>
            <input
              name="name"
              defaultValue={user?.name ?? ""}
              className="mt-1 block w-full rounded-md border border-slate-300
              px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800
              dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
              placeholder="أدخل اسمك"
            />
          </label>

          {/* Avatar */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              الصورة الشخصية
            </span>
            <input
              name="avatar"
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-slate-600 dark:text-slate-300
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
              file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-slate-800
              file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </label>

          {user?.avatarUrl && (
            <div className="flex items-center gap-4 mt-2">
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  الصورة الحالية
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 break-all">
                  {user.avatarUrl}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full inline-flex justify-center rounded-md px-4 py-2 text-white transition-all ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
          </button>
        </div>
      </form>
    </>
  );
}
