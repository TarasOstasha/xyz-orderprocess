import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as API from './../../api';

// Define Task Type
interface Task {
  id: number;
  title: string;
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
  isFetching: boolean;
  error: TaskError | null;
}

// test data
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Finish report',
    dueDate: '2024-02-21',
    status: ['Pending', 'Review'],
    priority: 'High',
  },
  {
    id: 2,
    title: 'Call client',
    dueDate: '2024-02-22',
    status: ['In Progress'],
    priority: 'Medium',
  },
  {
    id: 3,
    title: 'Prepare slides',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
  {
    id: 4,
    title: 'Prepare slides2',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
];

const TASKS_SLICE_NAME = 'tasks';

const initialState: TasksState = {
  tasks: initialTasks,
  isFetching: false,
  error: null,
};

// tasks/get
export const getTasksThunk = createAsyncThunk<Task[], void, { rejectValue: TaskError }>(
  `${TASKS_SLICE_NAME}/get`,
  async (payload, thunkAPI) => {
    try {
      const {
        data: { data },
      } = await API.getTasks();
      return data; // => payload
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

const tasksSlice = createSlice({
  name: TASKS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasksThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getTasksThunk.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isFetching = false;
        state.tasks = action.payload;
      })
      // ✅ Fix: Ensure `action.payload` is correctly typed as `TaskError`
      .addCase(getTasksThunk.rejected, (state, action: PayloadAction<TaskError | undefined>) => {
        state.isFetching = false;
        state.error = action.payload || { status: 500, message: 'Unknown error' };
      });
  },
});


const { reducer } = tasksSlice;

export default reducer;
