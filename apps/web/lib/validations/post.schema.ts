// lib/validations/post.schema.ts
import { z } from "zod";

// Create Post Schema
export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().max(5000, "Description is too long").optional(),
  published: z.boolean().default(false),
});

// Update Post Schema (same as create, but all optional)
export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z.string().max(5000, "Description is too long").optional(),
  published: z.boolean().optional(),
});

// Types
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
