import axiosInstance from './axiosInstance';

export type ProApiDto = {
  id: number;
  fullName: string;
  email: string;
  trade: string;
  city: string;
  hourlyRate: number;
};

export type CreateProRequest = {
  fullName: string;
  email: string;
  trade: string;
  city: string;
  hourlyRate: number;
};

export const prosApi = {
  async getAll(): Promise<ProApiDto[]> {
    const { data } = await axiosInstance.get<ProApiDto[]>('/Pros');
    return data;
  },

  async getByEmail(email: string): Promise<ProApiDto | null> {
    try {
      const { data } = await axiosInstance.get<ProApiDto>(
        `/Pros/by-email/${encodeURIComponent(email)}`
      );
      return data;
    } catch {
      return null;
    }
  },

  async create(req: CreateProRequest): Promise<ProApiDto> {
    const { data } = await axiosInstance.post<ProApiDto>('/Pros', req);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/Pros/${id}`);
  },
};
