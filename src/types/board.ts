export type BoardType = 'FRESHMAN' | 'FREE' | 'GRADUATE';
export type Language = 'KO' | 'EN' | 'ZH' | 'VI' | 'ES' | 'MN';

export interface PostSummary {
  postId: number;
  boardType: BoardType;
  title: string;
  authorName: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isAnonymous: boolean;
}

export interface PostDetail extends PostSummary {
  content: string;
  imageUrls: string[];
  isLiked: boolean;
  isOwner: boolean;
  originalLanguage: Language;
}

export interface CommentResponse {
  commentId: number;
  content: string;
  authorName: string | null;
  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  createdAt: string;
  children: CommentResponse[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  boardType: BoardType;
  isAnonymous: boolean;
  language: Language;
}

export interface CreateCommentRequest {
  content: string;
  isAnonymous: boolean;
  language: Language;
  parentId?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}
