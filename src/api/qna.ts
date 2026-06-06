import apiClient, { unwrap } from './client';
import type {
  CreateAnswerRequest,
  CreateQnARequest,
  Language,
  PageResponse,
  QnADetail,
  QnASummary,
} from '../types/qna';

export const qnaApi = {
  getQnas: (language: Language = 'KO', page = 0, size = 20, original = false) =>
    apiClient
      .get('/qnas', { params: { language, page, size, original } })
      .then(unwrap<PageResponse<QnASummary>>),

  getQna: (qnaId: number, language: Language = 'KO', original = false) =>
    apiClient.get(`/qnas/${qnaId}`, { params: { language, original } }).then(unwrap<QnADetail>),

  createQna: (body: CreateQnARequest) =>
    apiClient.post('/qnas', body).then(unwrap<QnADetail>),

  deleteQna: (qnaId: number) =>
    apiClient.delete(`/qnas/${qnaId}`).then(unwrap<null>),

  likeQna: (qnaId: number) =>
    apiClient.post(`/qnas/${qnaId}/like`).then(unwrap<{ liked: boolean }>),

  createAnswer: (qnaId: number, body: CreateAnswerRequest) =>
    apiClient.post(`/qnas/${qnaId}/answers`, body).then(unwrap<null>),

  deleteAnswer: (qnaId: number, answerId: number) =>
    apiClient.delete(`/qnas/${qnaId}/answers/${answerId}`).then(unwrap<null>),

  adoptAnswer: (qnaId: number, answerId: number) =>
    apiClient.post(`/qnas/${qnaId}/answers/${answerId}/adopt`).then(unwrap<null>),

  likeAnswer: (qnaId: number, answerId: number) =>
    apiClient
      .post(`/qnas/${qnaId}/answers/${answerId}/like`)
      .then(unwrap<{ liked: boolean }>),
};
