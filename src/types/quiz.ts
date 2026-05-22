export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
}

export interface QuizAnswerItem {
  questionId: number;
  selectedOption: number;
}

export interface QuizAnswerResult {
  questionId: number;
  correct: boolean;
  correctAnswer: number;
  explanation: string;
}

export interface QuizSubmitResponse {
  correctCount: number;
  totalCount: number;
  score: number;
  results: QuizAnswerResult[];
}

export interface MyQuizResult {
  id: number;
  correctCount: number;
  totalCount: number;
  score: number;
  completedAt: string;
}
