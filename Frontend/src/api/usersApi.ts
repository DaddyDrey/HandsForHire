import axiosInstance from './axiosInstance';

export type UserStatus = 'Active' | 'Suspended' | 'Verified';
type UserStatusApiValue = UserStatus | 0 | 1 | 2;

export type UserApiDto = {
  id: number;
  fullName: string;
  email: string;
  city: string;
  birthYear: number | null;
  phoneNumber: string;
  status: UserStatus;
  warningCount: number;
};

type BackendUserApiDto = Omit<UserApiDto, 'status'> & {
  status: UserStatusApiValue;
};

function normalizeUserStatus(status: UserStatusApiValue): UserStatus {
  if (status === 1 || status === 'Suspended') return 'Suspended';
  if (status === 2 || status === 'Verified') return 'Verified';
  return 'Active';
}

function normalizeUser(user: BackendUserApiDto): UserApiDto {
  return {
    ...user,
    status: normalizeUserStatus(user.status),
  };
}

export type UpdateUserRequest = {
  fullName: string;
  email: string;
  city: string;
  birthYear: number | null;
  phoneNumber: string;
};

export const usersApi = {
  async getByEmail(email: string): Promise<UserApiDto | null> {
    try {
      const { data } = await axiosInstance.get<BackendUserApiDto>(
        `/Users/by-email/${encodeURIComponent(email)}`
      );
      return normalizeUser(data);
    } catch {
      return null;
    }
  },

  async update(id: number, req: UpdateUserRequest): Promise<void> {
    try {
      await axiosInstance.put(`/Users/${id}`, req);
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? 'Could not update account.';
      throw new Error(message);
    }
  },
};

function getApiErrorMessage(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: unknown } }).response?.data === 'string'
  ) {
    return (error as { response: { data: string } }).response.data;
  }

  return null;
}
