export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ImageUser = {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type ImageItem = {
  id: number;
  user_id?: number;
  url: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  user?: ImageUser | null;
};

export type CommentItem = {
  id: number;
  content: string;
  user_id: number;
  image_id: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  user?: ImageUser | null;
};
