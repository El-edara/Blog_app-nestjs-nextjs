// general types
export interface User {
  id: number;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: "USER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
  comments?: Comment[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

export type SessionUser = {
  id: number;
  email: string;
  name?: string;
  role?: "USER" | "ADMIN";
};

export type SessionPayload = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

export type Session = SessionPayload & {
  iat?: number;
  exp?: number;
};

export type UpdateProfileDto = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
};

// ============= Post Types =============
export interface Post {
  id: number;
  title: string;
  description?: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    email: string;
    name?: string;
  };
  _count?: {
    comments: number;
  };
  comments?: Comment[];
}

export interface PostWithDetails extends Post {
  author: {
    id: number;
    email: string;
    name?: string;
  };
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============= Comment Types =============
export interface Comment {
  id: number;
  description: string;
  authorId: number;
  postId: number;
  createdAt: string;
  author?: {
    id: number;
    name?: string;
    avatarUrl?: string;
  };
  post?: {
    id: number;
    title: string;
  };
}

// ============= Profile Types =============
export interface Profile extends User {
  posts?: Post[];
  comments?: Comment[];
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface SinglePostClientPageProps {
  post: PostWithDetails;
  comments: Comment[];
  session: Session | null;
  isOwner: boolean;
}
