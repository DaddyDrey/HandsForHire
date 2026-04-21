import { createContext } from 'react';
import { axiosInstance } from './axiosInstance';

export const AxiosContext = createContext(axiosInstance);