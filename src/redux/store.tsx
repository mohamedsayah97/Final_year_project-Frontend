import { configureStore } from '@reduxjs/toolkit';
import addReducer from './features/addSlice';
import registerReducer from './features/registerSlice';
import loginReducer from './features/loginSlice';

export const store = configureStore({
  reducer: {
    add: addReducer,
    register: registerReducer,
    login: loginReducer,
  },
});

// Types pour TypeScript - export avec 'export type'
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;