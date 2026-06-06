export type Language = 'KO' | 'EN' | 'ZH' | 'VI' | 'UZ' | 'MN';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface QnASummary {
  qnaId: number;
  title: string;
  authorName: string;
  likeCount: number;
  answerCount: number;
  isAdopted: boolean;
  createdAt: string;
}

export interface AnswerResponse {
  answerId: number;
  content: string;
  originalContent: string;
  originalLanguage: Language;
  imageUrl: string | null;
  authorName: string;
  authorId: number | null;   // 익명이면 null

  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  isAdopted: boolean;
  createdAt: string;
}

export interface QnADetail extends QnASummary {
  content: string;
  originalTitle: string;
  originalContent: string;
  imageUrl: string | null;
  authorId: number | null;   // 익명이면 null
  isLiked: boolean;
  isOwner: boolean;
  answers: AnswerResponse[];
  originalLanguage: Language;
}

export interface CreateQnARequest {
  title: string;
  content: string;
  isAnonymous: boolean;
  language: Language;
  imageUrl?: string | null;
}

export interface CreateAnswerRequest {
  content: string;
  isAnonymous: boolean;
  language: Language;
  imageUrl?: string | null;
}
