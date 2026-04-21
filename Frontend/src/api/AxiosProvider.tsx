import type { ReactNode } from 'react';
import { AxiosContext } from './AxiosContext';
import { axiosInstance } from './axiosInstance';

type AxiosProviderProps = {
  children: ReactNode;
};

export function AxiosProvider({ children }: AxiosProviderProps) {
  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}