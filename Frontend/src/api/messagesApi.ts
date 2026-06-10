import axiosInstance from './axiosInstance';

export type MessageSender = 'User' | 'Pro';

export type ConversationApiDto = {
  id: number;
  userId: number;
  proId: number;
  userName: string;
  userEmail: string;
  proName: string;
  proEmail: string;
  proTrade: string;
  proCity: string;
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  lastMessageBody: string | null;
};

export type MessageApiDto = {
  id: number;
  conversationId: number;
  from: MessageSender;
  body: string;
  sentAt: string;
  readAt: string | null;
};

export type UserStatus = 'Active' | 'Suspended';

export type UserApiDto = {
  id: number;
  fullName: string;
  email: string;
  city: string;
  birthYear: number | null;
  phoneNumber: string;
  status: UserStatus;
  warningCount: number;
};

export const messagesApi = {
  async getAllUsers(): Promise<UserApiDto[]> {
    const { data } = await axiosInstance.get<UserApiDto[]>('/Users');
    return data;
  },

  async getUserByEmail(email: string): Promise<UserApiDto | null> {
    try {
      const { data } = await axiosInstance.get<UserApiDto>(
        `/Users/by-email/${encodeURIComponent(email)}`
      );
      return data;
    } catch {
      return null;
    }
  },

  async createUser(email: string, fullName: string): Promise<UserApiDto | null> {
    try {
      const { data } = await axiosInstance.post<UserApiDto>('/Users', {
        email,
        fullName,
      });
      return data;
    } catch {
      return null;
    }
  },

  async setUserStatus(id: number, status: UserStatus): Promise<void> {
    await axiosInstance.put(`/Users/${id}/status`, { status });
  },

  async getConversationsForUser(userId: number): Promise<ConversationApiDto[]> {
    const { data } = await axiosInstance.get<ConversationApiDto[]>(
      `/Conversations/user/${userId}`
    );
    return data;
  },

  async getConversationsForPro(proId: number): Promise<ConversationApiDto[]> {
    const { data } = await axiosInstance.get<ConversationApiDto[]>(
      `/Conversations/pro/${proId}`
    );
    return data;
  },

  async ensureConversation(userId: number, proId: number): Promise<ConversationApiDto> {
    const { data } = await axiosInstance.post<ConversationApiDto>('/Conversations', {
      userId,
      proId,
    });
    return data;
  },

  async deleteConversation(id: number): Promise<void> {
    await axiosInstance.delete(`/Conversations/${id}`);
  },

  async getMessages(conversationId: number): Promise<MessageApiDto[]> {
    const { data } = await axiosInstance.get<MessageApiDto[]>(
      `/Messages/conversation/${conversationId}`
    );
    return data;
  },

  async sendMessage(
    conversationId: number,
    from: MessageSender,
    body: string
  ): Promise<MessageApiDto> {
    const { data } = await axiosInstance.post<MessageApiDto>('/Messages', {
      conversationId,
      from,
      body,
    });
    return data;
  },

  async markRead(conversationId: number): Promise<void> {
    await axiosInstance.post(`/Messages/conversation/${conversationId}/read`);
  },

  async markReadAs(conversationId: number, viewer: MessageSender): Promise<void> {
    await axiosInstance.post(`/Messages/conversation/${conversationId}/read/${viewer}`);
  },

  async setTyping(conversationId: number, viewer: MessageSender): Promise<void> {
    await axiosInstance.post(`/Messages/conversation/${conversationId}/typing/${viewer}`);
  },

  async getOtherTyping(conversationId: number, viewer: MessageSender): Promise<boolean> {
    const { data } = await axiosInstance.get<{ isTyping: boolean }>(
      `/Messages/conversation/${conversationId}/typing/${viewer}`
    );
    return data.isTyping;
  },
};
