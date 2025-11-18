import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/posts.actions";
import { getCommentsByPostId } from "@/lib/actions/comments.actions";
import SinglePostClientPage from "@/components/posts/SinglePostClientPage";
import type { PostWithDetails } from "@/lib/types";

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) notFound();

  const [post, comments, session] = await Promise.all([
    getPostById(postId),
    getCommentsByPostId(postId),
    getSession(),
  ]);

  if (!post) notFound();

  // Ensure author is present so the prop matches PostWithDetails
  if (!post.author) notFound();

  const isOwner = session?.user?.id === post.authorId;

  return (
    <SinglePostClientPage
      post={post as PostWithDetails}
      comments={comments ?? []}
      session={session}
      isOwner={isOwner}
    />
  );
}
