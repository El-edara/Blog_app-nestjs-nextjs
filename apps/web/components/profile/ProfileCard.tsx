import { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Mail, Shield, User as UserIcon, Edit3 } from "lucide-react";

const ProfileCard = ({ profile }: { profile: Profile }) => {
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const isAdmin = profile.role === "ADMIN";

  return (
    <main className="min-h-screen from-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          {/* Header with linear */}
          <div className="h-32 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="relative px-6 pb-8 pt-4 -mt-16">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-8 ring-white dark:ring-gray-800 shadow-2xl">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name || "User"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                      {profile.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Admin Badge */}
                {isAdmin && (
                  <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.name || "Unnamed User"}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile.email}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">Role</span>
                </div>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white capitalize">
                  {profile.role?.toLowerCase() ?? "member"}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member Since</span>
                </div>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white text-sm">
                  {memberSince}
                </p>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.name
                  ? `Hey! I'm ${profile.name}, a passionate ${
                      isAdmin ? "administrator" : "user"
                    } on Blogify. I love sharing ideas and connecting with the community.`
                  : "This user hasn't set up their profile yet."}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-center md:justify-end">
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileCard;
