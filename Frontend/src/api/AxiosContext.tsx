import { createContext, useContext, type ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import axiosInstance from './axiosInstance';

const AxiosContext = createContext<AxiosInstance>(axiosInstance);

export const AxiosProvider = ({ children }: { children: ReactNode }) => (
  <AxiosContext.Provider value={axiosInstance}>
    {children}
  </AxiosContext.Provider>
);

export const useAxios = () => useContext(AxiosContext);