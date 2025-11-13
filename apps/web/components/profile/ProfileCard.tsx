import { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                {profile.avatarUrl ? (
                  // Next/Image ok for external domains if allowed in next.config
                  // fallback to <img> if not configured
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name || profile.email}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full mx-auto mb-4 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.name ?? "—"}</h1>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Role: <span className="font-medium">{profile.role}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Member since:{" "}
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>

            <div>
              <Link
                href="/profile/edit"
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit profile
              </Link>
            </div>
          </div>

          {/* quick stats or content */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
              About
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {profile.name
                ? `This is ${profile.name}'s profile.`
                : "No additional profile info yet."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ProfileCard;
