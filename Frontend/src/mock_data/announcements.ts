import { useAxios } from '../api/AxiosContext';

export type AnnouncementStatus = 'Open' | 'InProgress' | 'Completed' | 'Cancelled' | 'Paused';

export type Announcement = {
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

export type CreateAnnouncementPayload = {
  userId: number;
  title: string;
  description: string;
  category: string;
  city: string;
};

export type UpdateAnnouncementPayload = {
  title: string;
  description: string;
  category: string;
  city: string;
  status: AnnouncementStatus;
};

export const useAnnouncementService = () => {
  const axios = useAxios();

  const getAll = async (): Promise<Announcement[]> => {
    const { data } = await axios.get<Announcement[]>('/Announcements');
    return data;
  };

  const getForUser = async (userId: number): Promise<Announcement[]> => {
    const { data } = await axios.get<Announcement[]>(`/Announcements/user/${userId}`);
    return data;
  };

  const getById = async (id: number): Promise<Announcement> => {
    const { data } = await axios.get<Announcement>(`/Announcements/${id}`);
    return data;
  };

  const create = async (payload: CreateAnnouncementPayload): Promise<Announcement> => {
    const { data } = await axios.post<Announcement>('/Announcements', payload);
    return data;
  };

  const update = async (id: number, payload: UpdateAnnouncementPayload): Promise<void> => {
    await axios.put(`/Announcements/${id}`, payload);
  };

  const remove = async (id: number): Promise<void> => {
    await axios.delete(`/Announcements/${id}`);
  };

  return { getAll, getForUser, getById, create, update, remove };
};
