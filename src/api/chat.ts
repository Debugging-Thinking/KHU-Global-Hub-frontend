import apiClient, { unwrap } from './client';
import type { ChatMessage, ConversationSummary, SendMessageRequest } from '../types/chat';

export const chatApi = {
  getConversations: () =>
    apiClient.get('/chat').then(unwrap<ConversationSummary[]>),

  getMessages: (partnerId: number) =>
    apiClient.get(`/chat/${partnerId}`).then(unwrap<ChatMessage[]>),

  sendMessage: (body: SendMessageRequest) =>
    apiClient.post('/chat', body).then(unwrap<ChatMessage>),

  /** 내가 보낸 메시지 삭제. */
  deleteMessage: (messageId: number) =>
    apiClient.delete(`/chat/${messageId}`).then(unwrap<null>),
};
