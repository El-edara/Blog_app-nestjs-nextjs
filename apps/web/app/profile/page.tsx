import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/actions/profile.actions";
import ProfileCard from "@/components/profile/ProfileCard";

export const metadata: Metadata = {
  title: "Profile",
};
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Not signed in</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please{" "}
            <Link href="/auth/login" className="text-blue-500">
              sign in
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  // profile shape assumed: { id, email, name, avatarUrl, role, createdAt, updatedAt }
  return <ProfileCard profile={profile} />;
}
