import { ActionObject } from '../types'
import { UsersState } from '../types'
import { AT } from '../types/ActionTypes'
import { Reducer } from 'redux'

const initialState: UsersState = []

const reducer: Reducer<UsersState> = (state = initialState, action: ActionObject): UsersState => {
    switch (action.type) {
        case AT.GET_USERS_FULFILLED: {
            return [...action.users]
        }
        default:
            return state
    }
}

export default reducer