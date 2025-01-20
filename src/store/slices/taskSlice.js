import { createSlice } from '@reduxjs/toolkit';

const handleDates = (task) => ({
  ...task,
  startDate: task.startDate || null,
  endDate: task.endDate || null
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload.map(handleDates);
    },
    addTask: (state, action) => {
      state.items.push(handleDates(action.payload));
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = handleDates(action.payload);
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter(task => task._id !== action.payload);
    },
    updateTaskStatus: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const task = state.items.find(task => task._id === taskId);
      if (task) {
        task.status = newStatus;
      }
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask, updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;