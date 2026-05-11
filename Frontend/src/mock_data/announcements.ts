import { useCallback } from 'react';
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

  const getAll = useCallback(async (): Promise<Announcement[]> => {
    const { data } = await axios.get<Announcement[]>('/Announcements');
    return data;
  }, [axios]);

  const getForUser = useCallback(async (userId: number): Promise<Announcement[]> => {
    const { data } = await axios.get<Announcement[]>(`/Announcements/user/${userId}`);
    return data;
  }, [axios]);

  const getById = useCallback(async (id: number): Promise<Announcement> => {
    const { data } = await axios.get<Announcement>(`/Announcements/${id}`);
    return data;
  }, [axios]);

  const create = useCallback(async (payload: CreateAnnouncementPayload): Promise<Announcement> => {
    const { data } = await axios.post<Announcement>('/Announcements', payload);
    return data;
  }, [axios]);

  const update = useCallback(async (id: number, payload: UpdateAnnouncementPayload): Promise<void> => {
    await axios.put(`/Announcements/${id}`, payload);
  }, [axios]);

  const remove = useCallback(async (id: number): Promise<void> => {
    await axios.delete(`/Announcements/${id}`);
  }, [axios]);

  return { getAll, getForUser, getById, create, update, remove };
};
