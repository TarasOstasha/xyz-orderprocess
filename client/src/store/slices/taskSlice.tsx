import * as _ from 'lodash';
import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as API from './../../api';

// Define Task Type
interface Task {
  id: number;
  title: string;
  ship: string;
  art: string;
  inHand: string;
  dueDate: string;
  status: string[];
  priority: string;
}

// Define Error Type
interface TaskError {
  status: number;
  message: string;
}

interface TasksState {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  limit: number;
  isFetching: boolean;
  error: TaskError | null;
}

// test data
// const initialTasks: Task[] = [
//   {
//     id: 1,
//     title: 'Order 100',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-21',
//     status: ['Paid', 'Order from Vendor Confirmed'],
//     priority: 'High',
//   },
//   {
//     id: 2,
//     title: 'Order 101',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-22',
//     status: ['In Progress'],
//     priority: 'Medium',
//   },
//   {
//     id: 3,
//     title: 'Order 101',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 4,
//     title: 'Order 102',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 5,
//     title: 'Order 103',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-21',
//     status: ['Paid', 'Order from Vendor Confirmed'],
//     priority: 'High',
//   },
//   {
//     id: 6,
//     title: 'Order 104',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-22',
//     status: ['In Progress'],
//     priority: 'Medium',
//   },
//   {
//     id: 7,
//     title: 'Order 105',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 8,
//     title: 'Order 106',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 9,
//     title: 'Order 107',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-21',
//     status: ['Paid', 'Order from Vendor Confirmed'],
//     priority: 'High',
//   },
//   {
//     id: 10,
//     title: 'Order 108',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-22',
//     status: ['In Progress'],
//     priority: 'Medium',
//   },
//   {
//     id: 11,
//     title: 'Order 109',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 12,
//     title: 'Order 110',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 13,
//     title: 'Order 111',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-21',
//     status: ['Paid', 'Order from Vendor Confirmed'],
//     priority: 'High',
//   },
//   {
//     id: 14,
//     title: 'Order 112',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-22',
//     status: ['In Progress'],
//     priority: 'Medium',
//   },
//   {
//     id: 15,
//     title: 'Order 113',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
//   {
//     id: 16,
//     title: 'Order 114',
//     ship: 'Ship1 // AD',
//     art: '2024-02-22',
//     inHand: '2024-02-21',
//     dueDate: '2024-02-23',
//     status: ['Completed', 'On Hold'],
//     priority: 'Low',
//   },
// ];

const TASKS_SLICE_NAME = 'tasks';

const initialState: TasksState = {
  tasks: [],
  currentPage: 1,
  totalPages: 1,
  limit: 5,
  isFetching: false,
  error: null,
};



// task.create
export const createTaskThunk = createAsyncThunk<Task, Task, { rejectValue: TaskError }>(
  `${TASKS_SLICE_NAME}/create`,
  async (newTask, thunkAPI) => {
    const taskWithoutId: any = _.omit(newTask, 'id');
    try {
      const response = await API.createTask(taskWithoutId); 
      return response.data; // Assuming your API returns the created task
      return newTask
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue({
          status: err.response?.status || 500,
          message: err.response?.data?.errors || 'Unknown error',
        });
      }
      return thunkAPI.rejectWithValue({
        status: 500,
        message: 'Unexpected error',
      });
    }
  }
);


// tasks/get
export const getTasksThunk = createAsyncThunk<
  { tasks: Task[]; totalPages: number; currentPage: number }, // Success payload type
  { page: number; limit: number },  // Input parameters
  { rejectValue: TaskError }  // Error handling
>(
  `${TASKS_SLICE_NAME}/get`,
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await API.getTasks(page, limit);
      return response.data;  // Should return { tasks, totalPages, currentPage }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue({
          status: err.response?.status || 500,
          message: err.response?.data?.errors || 'Unknown error',
        });
      }
      return thunkAPI.rejectWithValue({
        status: 500,
        message: 'Unexpected error',
      });
    }
  }
);


// remove task
export const removeTaskThunk = createAsyncThunk<
  number, 
  number, 
  { rejectValue: TaskError }
>(
  'tasks/remove',
  async (taskId, thunkAPI) => {
    try {
      await API.removeTaskById(taskId); 
      return taskId;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue({
          status: err.response?.status || 500,
          message: err.response?.data?.errors || 'Unknown error',
        });
      }
      return thunkAPI.rejectWithValue({
        status: 500,
        message: 'Unexpected error',
      });
    }
  }
);

// update task
export const updateTaskThunk = createAsyncThunk<
  Task, // Returned data type
  Task, // Argument type
  { rejectValue: TaskError }
>('tasks/update', async (updatedTask, thunkAPI) => {
  try {
    //console.log(updatedTask, 'updatedTask')
    //const response = await API.updateTask(updatedTask.id, updatedTask); // Ensure your API supports this
    //console.log(response, 'response')
    //return response.data; // Assuming your API returns the updated task
    return updatedTask
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      status: err.response?.status || 500,
      message: err.response?.data?.error || 'Unknown error',
    });
  }
});

const tasksSlice = createSlice({
  name: TASKS_SLICE_NAME,
  initialState,
  reducers: {
     setCurrentPage: (state, action: PayloadAction<number>) => {
      console.log(action.payload, 'setCurrentPage')
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      console.log(action.payload, 'setItemsPerPage')
      state.limit = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getTasksThunk.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.tasks = payload.tasks;
        state.totalPages = payload.totalPages;
        state.currentPage = payload.currentPage;
      })
      .addCase(getTasksThunk.rejected, (state, action: PayloadAction<TaskError | undefined>) => {
        state.isFetching = false;
        state.error = action.payload || { status: 500, message: 'Unknown error' };
      })
      .addCase(removeTaskThunk.pending, state => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(removeTaskThunk.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        const deletedTaskIndex = state.tasks.findIndex(t => t.id === payload);
        if (deletedTaskIndex !== -1) {
          state.tasks.splice(deletedTaskIndex, 1);
        }
      })
      .addCase(removeTaskThunk.rejected, (state, action: PayloadAction<TaskError | undefined>) => {
        state.isFetching = false;
        state.error = action.payload || { status: 500, message: 'Unknown error' };
      })
      .addCase(updateTaskThunk.pending, state => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        const taskIndex = state.tasks.findIndex(t => t.id === payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...payload };
        }
      })
      .addCase(updateTaskThunk.rejected, (state, action: PayloadAction<TaskError | undefined>) => {
        state.isFetching = false;
        state.error = action.payload || { status: 500, message: 'Unknown error' };
      })
      .addCase(createTaskThunk.pending, state => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.tasks.push(payload);
      })
      .addCase(createTaskThunk.rejected, (state, action: PayloadAction<TaskError | undefined>) => {
        state.isFetching = false;
        state.error = action.payload || { status: 500, message: 'Unknown error' };
      });
  },
});


const { reducer, actions } = tasksSlice;

export const { setCurrentPage, setItemsPerPage } = actions;

export default reducer;
