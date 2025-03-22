import axios from 'axios';
import { SavePayload } from '../types';

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

function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error('Invalid data URL');
  const mime = mimeMatch[1]; // e.g. "image/png"

  const bstr = atob(arr[1]); // decode base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const getTasks = (page: number, limit: number) => axiosInstance.get(`/tasks?page=${page}&limit=${limit}`);

export const removeTaskById = (id: number) => axiosInstance.delete(`/tasks/${id}`);

// export const updateTask = ( task: SavePayload) => axiosInstance.put(`/tasks/${task.id}`, task);

// export const updateTask = (payload: SavePayload) => {
//   console.log(payload,'payload')
//   // 1) Build FormData
//   const formData = new FormData();

//   // -- Append simple text/number fields:
//   formData.append('title', payload.title || '');
//   formData.append('ship', payload.ship || '');
//   formData.append('art', payload.art || '');
//   formData.append('dueDate', payload.dueDate || '');
//   formData.append('inHand', payload.inHand || '');
//   formData.append('priority', payload.priority || '');

//   // If `status` is an array or object, convert to JSON
//   if (payload.status) {
//     formData.append('status', JSON.stringify(payload.status));
//   }

//   // -- Append object fields as JSON
//   formData.append('notes', JSON.stringify(payload.notes));
//   formData.append('steps', JSON.stringify(payload.steps));

//   // -- Append pastedHistory items (text + files)
//   payload.pastedHistory.forEach((item, index) => {
//     formData.append(`pastedHistory[${index}].text`, item.text || '');
  
//     if (item.images && item.images.length) {
//       item.images.forEach((base64Str, imgIndex) => {
//         // Convert the base64 string into a real File
//         const file = dataURLtoFile(
//           base64Str,
//           `pastedHistory-${index}-img-${imgIndex}.png`
//         );
//        // console.log(file, 'file')
//         formData.append(`pastedHistory[${index}].images`, file);
//       });
//     }
//   });
//   console.log(payload, 'payload')
//   //2) Send a PUT request with multipart/form-data
//   // for (let [key, value] of formData.entries()) {
//   //   console.log(key, value);
//   // }

//   return axiosInstance.put(`/tasks/${payload.id}`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };


export const updateTask = (payload: SavePayload) => {
  console.log('updateTask payload:', payload);

  // 1) Check if we have any base64 images in pastedHistory
  let hasImages = false;
  for (const item of payload.pastedHistory) {
    if (
      Array.isArray(item.images) &&
      item.images.some((img) => img.startsWith('data:image/'))
    ) {
      hasImages = true;
      break;
    }
  }

  // 2) If no images, just send JSON
  if (!hasImages) {
    return axiosInstance.put(`/tasks/${payload.id}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3) Otherwise, build FormData for text + images
  const formData = new FormData();

  // -- Append simple text/number fields:
  formData.append('title', payload.title || '');
  formData.append('ship', payload.ship || '');
  formData.append('art', payload.art || '');
  formData.append('dueDate', payload.dueDate || '');
  formData.append('inHand', payload.inHand || '');
  formData.append('priority', payload.priority || '');

  // -- status might be an array => stringify it
  if (payload.status) {
    formData.append('status', JSON.stringify(payload.status));
  }

  // -- notes, steps => also JSON
  formData.append('notes', JSON.stringify(payload.notes || {}));
  formData.append('steps', JSON.stringify(payload.steps || []));

  // -- pastedHistory items: text + files
  payload.pastedHistory.forEach((item, index) => {
    formData.append(`pastedHistory[${index}].text`, item.text || '');

    if (item.images && item.images.length) {
      item.images.forEach((base64Str, imgIndex) => {
        // Convert the base64 string into a real File
        const file = dataURLtoFile(
          base64Str,
          `pastedHistory-${index}-img-${imgIndex}.png`
        );
        formData.append(`pastedHistory[${index}].images`, file);
      });
    }
  });

  // Debug: see exactly what keys are in formData
  // for (const [key, val] of formData.entries()) {
  //   console.log(key, val);
  // }

  // 4) Send a PUT request with multipart/form-data
  return axiosInstance.put(`/tasks/${payload.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const getTaskInfo = (id: number) => axiosInstance.get(`/tasks/${id}`);

export const createTask = (task: Task) => axiosInstance.post('/tasks', task);

// export default axiosInstance;
