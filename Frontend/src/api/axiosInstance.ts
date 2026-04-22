import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5010/api',
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 404) console.error('Resursa nu a fost găsită (404)');
    if (status === 500) console.error('Eroare server (500)');
    if (!error.response) console.error('Serverul nu răspunde');
    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;
