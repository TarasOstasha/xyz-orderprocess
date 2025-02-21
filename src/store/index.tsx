import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/TaskSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer, 
  },
});

export default store;
