import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: string[];
  priority: string;
}

export const getTasks = (page: number, limit: number) => axiosInstance.get(`/tasks?page=${page}&limit=${limit}`);

export const removeTaskById = (id: number) => axiosInstance.delete(`/tasks/${id}`);

export const updateTask = ( task: Task) => axiosInstance.put(`/tasks/${task.id}`, task);

export const createTask = (task: Task) => axiosInstance.post('/tasks', task);

// export default axiosInstance;
