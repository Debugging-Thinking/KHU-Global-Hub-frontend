export type Language = 'KO' | 'EN' | 'ZH' | 'VI' | 'UZ' | 'MN';

export interface PostSummary {
  postId: number;
  title: string;
  authorName: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isAnonymous: boolean;
}

export interface PostDetail extends PostSummary {
  content: string;
  originalTitle: string;
  originalContent: string;
  authorId: number | null;   // 익명이면 null
  imageUrls: string[];
  isLiked: boolean;
  isOwner: boolean;
  originalLanguage: Language;
}

export interface CommentResponse {
  commentId: number;
  content: string;
  originalContent: string;
  originalLanguage: Language;
  imageUrl: string | null;
  authorName: string | null;
  authorId: number | null;   // 익명이면 null

  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  createdAt: string;
  children: CommentResponse[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  isAnonymous: boolean;
  language: Language;
}

export interface CreateCommentRequest {
  content: string;
  isAnonymous: boolean;
  language: Language;
  parentId?: number;
  imageUrl?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}
