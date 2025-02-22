import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getTasks = () => axiosInstance.get('/tasks');

export const removeTaskById = (id: number) => axiosInstance.delete(`/tasks/${id}`);

// export default axiosInstance;
