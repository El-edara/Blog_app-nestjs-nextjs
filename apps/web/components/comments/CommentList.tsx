import { Comment } from "@/lib/types";
import CommentItem from "./CommentItem";
import { MessageSquare } from "lucide-react";

type Props = {
  comments: Comment[];
  postId: number;
  currentUserId?: number;
};

export default function CommentList({
  comments,
  postId,
  currentUserId,
}: Props) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </p>
      {comments.map((comment, index) => (
        <CommentItem
          key={index}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
