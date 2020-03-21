import { ActionObject } from '../types'
import { AT, UserState } from '../types'
import { Reducer } from 'redux'
import { microsoftProvider } from '../providers/microsoft'
import RSA from 'react-simple-auth'

const unauthenticatedState: UserState = {
    isLoggedIn: false,
    id: '',
    name: ''
}

const initialState = { ...unauthenticatedState }

const session = RSA.restoreSession(microsoftProvider)
if (session) {
    initialState.isLoggedIn = true
    initialState.id = session.decodedIdToken.oid
    initialState.name = session.decodedIdToken.name
}

const userReducer: Reducer<UserState> = (state = initialState, action: ActionObject): UserState => {
    switch (action.type) {
        case AT.USER_LOGIN:
            return { ...state, isLoggedIn: true, id: action.id, name: action.name }
        case AT.USER_LOGOUT:
            RSA.invalidateSession()
            return { ...unauthenticatedState };
        default:
            return state;
    }
}

export default userReducer;