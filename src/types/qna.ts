export type Language = 'KO' | 'EN' | 'ZH' | 'VI' | 'ES' | 'MN';

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
  authorName: string;
  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  isAdopted: boolean;
  createdAt: string;
}

export interface QnADetail extends QnASummary {
  content: string;
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
}

export interface CreateAnswerRequest {
  content: string;
  isAnonymous: boolean;
  language: Language;
}
