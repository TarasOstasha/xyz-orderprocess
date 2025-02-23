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
  {
    id: 5,
    title: 'Finish report',
    dueDate: '2024-02-21',
    status: ['Pending', 'Review'],
    priority: 'High',
  },
  {
    id: 6,
    title: 'Call client',
    dueDate: '2024-02-22',
    status: ['In Progress'],
    priority: 'Medium',
  },
  {
    id: 7,
    title: 'Prepare slides',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
  {
    id: 8,
    title: 'Prepare slides2',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
  {
    id: 9,
    title: 'Finish report',
    dueDate: '2024-02-21',
    status: ['Pending', 'Review'],
    priority: 'High',
  },
  {
    id: 10,
    title: 'Call client',
    dueDate: '2024-02-22',
    status: ['In Progress'],
    priority: 'Medium',
  },
  {
    id: 11,
    title: 'Prepare slides',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
  {
    id: 12,
    title: 'Prepare slides2',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
  {
    id: 13,
    title: 'Finish report',
    dueDate: '2024-02-21',
    status: ['Pending', 'Review'],
    priority: 'High',
  },
  {
    id: 14,
    title: 'Call client',
    dueDate: '2024-02-22',
    status: ['In Progress'],
    priority: 'Medium',
  },
  {
    id: 15,
    title: 'Prepare slides',
    dueDate: '2024-02-23',
    status: ['Completed', 'On Hold'],
    priority: 'Low',
  },
  {
    id: 16,
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



// task.create
export const createTaskThunk = createAsyncThunk<Task, Task, { rejectValue: TaskError }>(
  `${TASKS_SLICE_NAME}/create`,
  async (newTask, thunkAPI) => {
    console.log(newTask, 'newTask')
    try {
      //const response = await API.createTask(newTask); // Ensure your API supports this
      //return response.data; // Assuming your API returns the created task
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

// remove task
export const removeTaskThunk = createAsyncThunk<
  number, 
  number, 
  { rejectValue: TaskError }
>(
  'tasks/remove',
  async (taskId, thunkAPI) => {
    try {
      //await API.removeTaskById(taskId); 
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


const { reducer } = tasksSlice;

export default reducer;
