import { getMyPosts } from "@/lib/actions/posts.actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MinePostCard from "@/components/posts/MinePostCard";

export default async function MyPostsPage() {
  const session = await getSession();

  // Redirect if not logged in
  if (session?.user.role === "ADMIN") {
    redirect("/admin");
  } else if (!session) {
    redirect("/login");
  }

  const posts = await getMyPosts();

  return <MinePostCard posts={posts} />;
}
