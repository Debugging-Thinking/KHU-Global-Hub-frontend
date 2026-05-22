import apiClient, { unwrap } from './client';
import type {
  CommentResponse,
  CreateCommentRequest,
  CreatePostRequest,
  Language,
  PageResponse,
  PostDetail,
  PostSummary,
} from '../types/board';

export const boardApi = {
  getPosts: (language: Language = 'KO', page = 0, size = 20) =>
    apiClient
      .get('/posts', { params: { language, page, size } })
      .then(unwrap<PageResponse<PostSummary>>),

  getPopular: (language: Language = 'KO') =>
    apiClient.get('/posts/popular', { params: { language } }).then(unwrap<PostSummary[]>),

  getPost: (postId: number, language: Language = 'KO') =>
    apiClient.get(`/posts/${postId}`, { params: { language } }).then(unwrap<PostDetail>),

  createPost: (body: CreatePostRequest) => {
    const form = new FormData();
    form.append('title', body.title);
    form.append('content', body.content);
    form.append('isAnonymous', String(body.isAnonymous));
    form.append('language', body.language);
    return apiClient.post('/posts', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrap<number>);
  },

  deletePost: (postId: number) =>
    apiClient.delete(`/posts/${postId}`).then(unwrap<null>),

  likePost: (postId: number) =>
    apiClient.post(`/posts/${postId}/like`).then(unwrap<{ liked: boolean }>),

  getComments: (postId: number, language: Language = 'KO') =>
    apiClient
      .get(`/posts/${postId}/comments`, { params: { language } })
      .then(unwrap<CommentResponse[]>),

  createComment: (postId: number, body: CreateCommentRequest) =>
    apiClient.post(`/posts/${postId}/comments`, body).then(unwrap<CommentResponse>),

  deleteComment: (commentId: number) =>
    apiClient.delete(`/comments/${commentId}`).then(unwrap<null>),

  likeComment: (commentId: number) =>
    apiClient.post(`/comments/${commentId}/like`).then(unwrap<{ liked: boolean }>),
};
