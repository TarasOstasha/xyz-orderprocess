import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/taskSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer, 
  },
});

export default store;
