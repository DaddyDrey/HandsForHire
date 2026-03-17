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

export const useUserService = () => {
  const axios = useAxios();

  const getCurrentUser = async (): Promise<UserProfile> => {
    const { data } = await axios.get<UserProfile>('/user/me');
    return data;
  };

  return { getCurrentUser };
};