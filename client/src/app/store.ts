import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import * as models from '../types/models'
import usersReducer from '../routes/Users/usersSlice'
import scoresReducer from '../routes/Scores/scoresSlice'
import gameReducer from '../routes/Game/gameSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    scores: scoresReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export type StartThunk = ThunkAction<void, RootState, unknown, Action<string>>
export type ClickCellThunk = ThunkAction<void, RootState, unknown, Action<models.ICell>>
