import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import usersReducer from '../routes/Users/usersSlice'
import scoresReducer from '../routes/Scores/scoresSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    scores: scoresReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export type StartThunk = ThunkAction<void, RootState, unknown, Action<string>>
