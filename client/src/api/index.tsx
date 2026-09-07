import axios from 'axios';
import _ from 'lodash';
import { SavePayload } from '../types';
import { getStoredToken, TOKEN_KEY } from '../utils/authStorage';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url || '');
      const isAuthAttempt =
        url.includes('/auth/login') || url.includes('/auth/signup');
      if (!isAuthAttempt) {
        localStorage.removeItem(TOKEN_KEY);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.assign('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: string[];
  priority: string;
}

function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error('Invalid data URL');
  const mime = mimeMatch[1];

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const signup = (payload: { name: string; email: string; password: string }) =>
  axiosInstance.post('/auth/signup', payload);

export const login = (payload: { email: string; password: string }) =>
  axiosInstance.post('/auth/login', payload);

export const getMe = () => axiosInstance.get('/auth/me');

export const getTasks = (page: number, limit: number, search = '') => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search.trim()) {
    params.set('search', search.trim());
  }
  return axiosInstance.get(`/tasks?${params.toString()}`);
};

export const removeTaskById = (id: number) => axiosInstance.delete(`/tasks/${id}`);

export const updateTask = (payload: SavePayload) => {
  console.log(payload, 'payload');
  const formData = new FormData();

  formData.append('title', payload.title || '');
  formData.append('ship', payload.ship || '');
  formData.append('art', payload.art || '');
  formData.append('dueDate', payload.dueDate || '');
  formData.append('inHand', payload.inHand || '');
  formData.append('priority', payload.priority || '');

  if (payload.status) {
    formData.append('status', JSON.stringify(payload.status));
  }

  formData.append('notes', JSON.stringify(payload.notes));
  const sanitizedSteps = payload.steps.map((step) => _.omit(step, 'id'));
  formData.append('steps', JSON.stringify(sanitizedSteps));

  payload.pastedHistory.forEach((item, index) => {
    formData.append(`pastedHistory[${index}].text`, item.text || '');

    if (item.images && item.images.length) {
      item.images.forEach((base64Str, imgIndex) => {
        const file = dataURLtoFile(
          base64Str,
          `pastedHistory-${index}-img-${imgIndex}.png`
        );
        formData.append(`pastedHistory[${index}].images`, file);
      });
    }
  });

  return axiosInstance.put(`/tasks/${payload.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createTask = (task: Task) => axiosInstance.post('/tasks', task);

export const addPastedHistory = (taskId: number, text: string, images: string[]) => {
  const formData = new FormData();
  formData.append('text', text || '');

  images.forEach((img, imgIndex) => {
    if (img.startsWith('data:')) {
      const file = dataURLtoFile(img, `paste-${Date.now()}-${imgIndex}.png`);
      formData.append('images', file);
    }
  });

  return axiosInstance.post(`/tasks/${taskId}/pasted-history`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updatePastedHistory = (
  taskId: number,
  pasteId: number,
  text: string,
  images: string[] = []
) => {
  const formData = new FormData();
  formData.append('text', text || '');

  images.forEach((img, imgIndex) => {
    if (img.startsWith('data:')) {
      const file = dataURLtoFile(img, `paste-edit-${Date.now()}-${imgIndex}.png`);
      formData.append('images', file);
    }
  });

  return axiosInstance.put(`/tasks/${taskId}/pasted-history/${pasteId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletePastedHistory = (taskId: number, pasteId: number) =>
  axiosInstance.delete(`/tasks/${taskId}/pasted-history/${pasteId}`);

export const getTaskPresence = (taskId: number) =>
  axiosInstance.get(`/tasks/${taskId}/presence`);

export const upsertTaskPresence = (taskId: number) =>
  axiosInstance.post(`/tasks/${taskId}/presence`);

export const leaveTaskPresence = (taskId: number) =>
  axiosInstance.delete(`/tasks/${taskId}/presence`);
