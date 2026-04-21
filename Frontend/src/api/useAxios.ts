import { useContext } from 'react';
import { AxiosContext } from './AxiosContext';

export function useAxios() {
  return useContext(AxiosContext);
}