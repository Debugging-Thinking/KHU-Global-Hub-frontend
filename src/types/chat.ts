export interface ConversationSummary {
  partnerId: number;
  partnerName: string;
  partnerProfileImage: string | null;
  lastMessage: string;
  unreadCount: number;
  lastMessageAt: string;
}

export interface ChatMessage {
  messageId: number;
  senderId: number | null;
  senderName: string | null;
  content: string;
  imageUrl: string | null;
  isSystem: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  receiverId: number;
  content: string;
  imageUrl?: string | null;
}
