import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import indexReducer from '../routes/Index/gameSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    index: indexReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type StartThunk = ThunkAction<void, RootState, unknown, Action<string>>;
