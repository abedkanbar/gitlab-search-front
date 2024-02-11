import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.REACT_APP_GITLAB_BACKEND_URL,
});

apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (!token) {
    localStorage.setItem('redirectUrl', window.location.pathname);
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiService;