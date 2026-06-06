import apiClient, { unwrap } from './client';
import type { Language, PageResponse } from '../types/board';
import type { CreateReviewRequest, LectureDetail, LectureSummary } from '../types/lecture';

export const lectureApi = {
  getLectures: (query = '', semester = '2026-1', page = 0, size = 30) =>
    apiClient
      .get('/lectures', { params: { semester, query: query || undefined, page, size } })
      .then(unwrap<PageResponse<LectureSummary>>),

  getLecture: (lectureId: number, language: Language = 'KO') =>
    apiClient.get(`/lectures/${lectureId}`, { params: { language } }).then(unwrap<LectureDetail>),

  createReview: (lectureId: number, body: CreateReviewRequest) =>
    apiClient.post(`/lectures/${lectureId}/reviews`, body).then(unwrap<number>),

  deleteReview: (reviewId: number) =>
    apiClient.delete(`/lectures/reviews/${reviewId}`).then(unwrap<null>),
};
