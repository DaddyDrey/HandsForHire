import axiosInstance from './axiosInstance';

export type ReviewApiDto = {
  id: number;
  proId: number;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CreateReviewRequest = {
  proId: number;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
};

export type UpdateReviewRequest = {
  proId: number;
  reviewerName: string;
  rating: number;
  comment: string;
};

export const reviewsApi = {
  async getAll(): Promise<ReviewApiDto[]> {
    const { data } = await axiosInstance.get<ReviewApiDto[]>('/Reviews');
    return data;
  },

  async getForPro(proId: number): Promise<ReviewApiDto[]> {
    const { data } = await axiosInstance.get<ReviewApiDto[]>(`/Reviews/pro/${proId}`);
    return data;
  },

  async create(req: CreateReviewRequest): Promise<ReviewApiDto> {
    const { data } = await axiosInstance.post<ReviewApiDto>('/Reviews', req);
    return data;
  },

  async update(id: number, req: UpdateReviewRequest): Promise<void> {
    await axiosInstance.put(`/Reviews/${id}`, req);
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/Reviews/${id}`);
  },
};
