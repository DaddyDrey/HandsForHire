import { useCallback } from 'react';
import { useAxios } from '../api/AxiosContext';

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type Pro = {
  id: string;
  name: string;
  age: number;
  trade: string;
  city: string;
  rating: number;
  reviewsCount: number;
  hourlyFrom: number;
  tags: string[];
  description: string;
  reviews: Review[];
};

export const useProService = () => {
  const axios = useAxios();

  const getAll = useCallback(async (): Promise<Pro[]> => {
    const { data } = await axios.get<Pro[]>('/profesionisti');
    return data;
  }, [axios]);

  const getById = useCallback(async (id: string): Promise<Pro> => {
    const { data } = await axios.get<Pro>(`/profesionisti/${id}`);
    return data;
  }, [axios]);

  return { getAll, getById };
};
