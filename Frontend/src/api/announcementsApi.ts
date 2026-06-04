import axiosInstance from './axiosInstance';

export type AnnouncementStatus = 'Open' | 'InProgress' | 'Completed' | 'Cancelled' | 'Paused';

export type AnnouncementApiDto = {
  id: number;
  userId: number;
  authorName: string;
  authorEmail: string;
  title: string;
  description: string;
  category: string;
  city: string;
  status: AnnouncementStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnouncementRequest = {
  userId: number;
  title: string;
  description: string;
  category: string;
  city: string;
};

export type UpdateAnnouncementRequest = {
  title: string;
  description: string;
  category: string;
  city: string;
  status: AnnouncementStatus;
};

export const announcementsApi = {
  async getAll(): Promise<AnnouncementApiDto[]> {
    const { data } = await axiosInstance.get<AnnouncementApiDto[]>('/Announcements');
    return data;
  },

  async getForUser(userId: number): Promise<AnnouncementApiDto[]> {
    const { data } = await axiosInstance.get<AnnouncementApiDto[]>(`/Announcements/user/${userId}`);
    return data;
  },

  async getById(id: number): Promise<AnnouncementApiDto> {
    const { data } = await axiosInstance.get<AnnouncementApiDto>(`/Announcements/${id}`);
    return data;
  },

  async create(payload: CreateAnnouncementRequest): Promise<AnnouncementApiDto> {
    const { data } = await axiosInstance.post<AnnouncementApiDto>('/Announcements', payload);
    return data;
  },

  async update(id: number, payload: UpdateAnnouncementRequest): Promise<void> {
    await axiosInstance.put(`/Announcements/${id}`, payload);
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/Announcements/${id}`);
  },

  async deleteForUser(id: number, userId: number): Promise<void> {
    await axiosInstance.delete(`/Announcements/${id}/user/${userId}`);
  },
};
