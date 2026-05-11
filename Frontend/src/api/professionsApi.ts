import axiosInstance from "./axiosInstance";

export type ProfessionDto = {
  id: number;
  name: string;
};

export const professionsApi = {
  async getAll(): Promise<ProfessionDto[]> {
    const { data } = await axiosInstance.get<ProfessionDto[]>("/Professions");
    return data;
  },

  async create(name: string): Promise<ProfessionDto> {
    const { data } = await axiosInstance.post<ProfessionDto>("/Professions", { name });
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(`/Professions/${id}`);
  },
};
