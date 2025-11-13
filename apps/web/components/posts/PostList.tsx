import * as motion from "framer-motion/client";
import { Post } from "@/lib/types";
import PostCard from "./PostCard";

const PostList = ({ posts }: { posts: Post[] }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No posts found
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {posts.map((post, index) => (
        <PostCard key={post.id} index={index} post={post} />
      ))}
    </motion.div>
  );
};

export default PostList;
