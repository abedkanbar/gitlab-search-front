import axios from 'axios';
import { LocalStorageConstants } from '../local-storage-constants';

const apiService = axios.create({
  baseURL: process.env.REACT_APP_GITLAB_BACKEND_URL,
});

apiService.interceptors.request.use((config) => {
  const token = LocalStorageConstants.getString(LocalStorageConstants.Token);
  if (!token) {
    LocalStorageConstants.setItem(LocalStorageConstants.RedirectUrl, window.location.pathname);
    window.location.href = '/login';
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      LocalStorageConstants.removeItem(LocalStorageConstants.Token);
      window.location.href = '/login';
    }
    return Promise.reject(error.response.data);
  }
);

export default apiService;