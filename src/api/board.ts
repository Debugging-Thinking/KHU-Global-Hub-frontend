import { Platform } from 'react-native';
import apiClient, { unwrap } from './client';
import type { PickedImage } from '../lib/pickImages';
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
  getPosts: (language: Language = 'KO', page = 0, size = 20, original = false) =>
    apiClient
      .get('/posts', { params: { language, page, size, original } })
      .then(unwrap<PageResponse<PostSummary>>),

  getPopular: (language: Language = 'KO', original = false) =>
    apiClient.get('/posts/popular', { params: { language, original } }).then(unwrap<PostSummary[]>),

  getPost: (postId: number, language: Language = 'KO', original = false) =>
    apiClient.get(`/posts/${postId}`, { params: { language, original } }).then(unwrap<PostDetail>),

  createPost: async (body: CreatePostRequest, images: PickedImage[] = []) => {
    const form = new FormData();
    form.append('title', body.title);
    form.append('content', body.content);
    form.append('isAnonymous', String(body.isAnonymous));
    form.append('language', body.language);
    for (const asset of images) {
      if (Platform.OS === 'web') {
        if (asset.file) form.append('images', asset.file);
        else {
          const res = await fetch(asset.uri);
          const blob = await res.blob();
          form.append('images', blob, asset.fileName ?? 'post.jpg');
        }
      } else {
        form.append('images', { uri: asset.uri, type: asset.mimeType ?? 'image/jpeg', name: asset.fileName ?? 'post.jpg' } as any);
      }
    }
    // 웹은 Content-Type 수동 설정 금지(브라우저가 boundary 포함 자동 설정).
    const config = Platform.OS === 'web' ? undefined : { headers: { 'Content-Type': 'multipart/form-data' } };
    return apiClient.post('/posts', form, config).then(unwrap<number>);
  },

  deletePost: (postId: number) =>
    apiClient.delete(`/posts/${postId}`).then(unwrap<null>),

  likePost: (postId: number) =>
    apiClient.post(`/posts/${postId}/like`).then(unwrap<{ liked: boolean }>),

  getComments: (postId: number, language: Language = 'KO', original = false) =>
    apiClient
      .get(`/posts/${postId}/comments`, { params: { language, original } })
      .then(unwrap<CommentResponse[]>),

  createComment: (postId: number, body: CreateCommentRequest) =>
    apiClient.post(`/posts/${postId}/comments`, body).then(unwrap<CommentResponse>),

  deleteComment: (commentId: number) =>
    apiClient.delete(`/comments/${commentId}`).then(unwrap<null>),

  likeComment: (commentId: number) =>
    apiClient.post(`/comments/${commentId}/like`).then(unwrap<{ liked: boolean }>),
};
