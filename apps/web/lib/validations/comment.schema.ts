import { z } from "zod";

// Create Comment Schema
export const createCommentSchema = z.object({
  description: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long (max 1000 characters)"),
  postId: z.number().positive("Post ID is required"),
});

// Update Comment Schema
export const updateCommentSchema = z.object({
  description: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long (max 1000 characters)"),
});

// Types
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
