import apiClient, { unwrap } from './client';
import type { MyQuizResult, QuizQuestion, QuizSubmitResponse } from '../types/quiz';

export const quizApi = {
  getQuestions: (category?: string) =>
    apiClient
      .get('/quiz/questions', { params: category ? { category } : {} })
      .then(unwrap<QuizQuestion[]>),

  submit: (answers: { questionId: number; selectedOption: number }[]) =>
    apiClient
      .post('/quiz/submit', { answers })
      .then(unwrap<QuizSubmitResponse>),

  getMyResults: () =>
    apiClient.get('/quiz/results/me').then(unwrap<MyQuizResult[]>),

  getMyBestScore: () =>
    apiClient.get('/quiz/score/me').then(unwrap<number>),
};
