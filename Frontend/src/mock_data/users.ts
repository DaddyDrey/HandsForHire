import { useAxios } from '../api/AxiosContext';

export type Announcement = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
};

export type ProCheckout = {
  id: string;
  proId: string;
  proName: string;
  trade: string;
  city: string;
  viewedAt: string;
};

export type UserProfile = {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  createdAt: string;
  announcements: Announcement[];
  prosCheckedOut: ProCheckout[];
};

export const MOCK_USER: UserProfile = {
  email: 'demo@handsforhire.com',
  fullName: 'Demo User',
  phone: '+373 00 000 000',
  city: 'Chișinău',
  createdAt: '2026-02-01',
  announcements: [
    { id: 'a1', title: 'Fix kitchen sink', status: 'active', createdAt: '2026-02-10' },
    { id: 'a2', title: 'Paint living room', status: 'paused', createdAt: '2026-02-12' },
  ],
  prosCheckedOut: [
    { id: 'h1', proId: '1', proName: 'Alex M.', trade: 'Electrician', city: 'Chișinău', viewedAt: '2026-02-20' },
    { id: 'h2', proId: '2', proName: 'Irina P.', trade: 'Plumber', city: 'Bălți', viewedAt: '2026-02-21' },
  ],
};

export const useUserService = () => {
  const axios = useAxios();

  const getCurrentUser = async (): Promise<UserProfile> => {
    const { data } = await axios.get<UserProfile>('/user/me');
    return data;
  };

  return { getCurrentUser };
};
