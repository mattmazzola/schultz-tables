import { ActionObject } from '../types'
import { ProfileState } from '../types'
import { AT } from '../types/ActionTypes'
import { Reducer } from 'redux'
import { getUserTableTypeKey } from '../services/utilities';

const initialState: ProfileState = {
    tableTypes: [],
    scoresByUserAndType: {}
}

const reducer: Reducer<ProfileState> = (state = initialState, action: ActionObject): ProfileState => {
    switch (action.type) {
        case AT.GET_TABLE_TYPES_FULFILLED: {
            return {
                ...state,
                tableTypes: action.tableTypes
            }
        }
        case AT.GET_USER_SCORES_FULFILLED: {
            // Create copy of existing map
            const key = getUserTableTypeKey(action.userId, action.tableTypeId)

            const scoresByUserAndType = {
                ...state.scoresByUserAndType,
                [key]: action.scores
            }
            return {
                ...state,
                scoresByUserAndType
            }
        }
        default:
            return state
    }
}

export default reducer