import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5052/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    if (status === 404) console.error(`Resursa nu a fost găsită (404): ${url}`);
    else if (status === 500) console.error(`Eroare server (500): ${url}`);
    else if (!error.response) console.error(`Serverul nu răspunde la ${baseURL}${url ?? ''}`);
    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;
