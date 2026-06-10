import axiosInstance from './axiosInstance';

export type ReportCategory = 'Conduct' | 'Reliability' | 'Payment' | 'Fraud' | 'Spam' | 'Other';
export type ReportSeverity = 'Medium' | 'High';
export type ReportStatus = 'Pending' | 'Resolved';
export type ReportAction = 'None' | 'Reviewed' | 'Suspended' | 'Escalated' | 'Warned';

export type ReportApiDto = {
  id: number;
  title: string;
  description: string;
  reporterEmail: string;
  targetEmail: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  actionTaken: ReportAction;
  createdAt: string;
  resolvedAt: string | null;
};

export type CreateReportRequest = {
  title: string;
  description: string;
  reporterEmail: string;
  targetEmail: string;
  category: ReportCategory;
  severity?: ReportSeverity;
};

export type UpdateReportRequest = {
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  actionTaken: ReportAction;
};

export const reportsApi = {
  async getAll(): Promise<ReportApiDto[]> {
    const { data } = await axiosInstance.get<ReportApiDto[]>('/Reports');
    return data;
  },

  async create(req: CreateReportRequest): Promise<ReportApiDto> {
    const { data } = await axiosInstance.post<ReportApiDto>('/Reports', req);
    return data;
  },

  async update(id: number, req: UpdateReportRequest): Promise<void> {
    await axiosInstance.put(`/Reports/${id}`, req);
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/Reports/${id}`);
  },
};
