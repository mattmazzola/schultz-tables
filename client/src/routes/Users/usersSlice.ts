import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../../app/store'
import * as models from "../../types/models"
import { delay } from "../../utilities"
import * as client from "../../services/client"

interface UserState {
  loading: boolean
  users: models.IUser[]
}

const initialState: UserState = {
  loading: false,
  users: [],
}

export const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setUsers: (state, action: PayloadAction<models.IUser[]>) => {
      state.users = action.payload
    },
  },
})

export const { setLoading, setUsers } = slice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getUsersAsync = (token: string): AppThunk => async dispatch => {
  dispatch(setLoading(true))

  const users = await client.getUsers(token)

  dispatch(setUsers(users))
  dispatch(setLoading(false))
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsers = (state: RootState) =>
  state.users

export default slice.reducer
