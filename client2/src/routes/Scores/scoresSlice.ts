import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../../app/store'
import * as models from "../../types/models"
import { delay } from "../../utilities"
import * as options from "../../utilities/options"
import * as client from '../../services/client'

interface ScoresState {
    tableTypes: models.ITableType[],
    loading: boolean
    scoresByType: { [key: string]: models.IScoresResponse }
}

const tableTypes: models.ITableType[] = [
    {
        height: 4,
        width: 4,
        id: '234',
        properties: [],
    },
    {
        height: 5,
        width: 5,
        id: '234234',
        properties: [],
    },
]

const initialState: ScoresState = {
    tableTypes,
    loading: false,
    scoresByType: {},
}

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        addScoreToType: (state, action: PayloadAction<{ scoreType: string, response: models.IScoresResponse }>) => {
            const { scoreType, response } = action.payload

            let scoresByType = state.scoresByType[scoreType]
            if (scoresByType === undefined) {
                scoresByType = {
                    scores: [],
                    users: [],
                    continuationToken: null,
                }

                state.scoresByType[scoreType] = scoresByType
            }

            scoresByType.scores.push(...response.scores)
            scoresByType.users.push(...response.users)
            scoresByType.continuationToken = response.continuationToken
        },
        setTableTypes: (state, action: PayloadAction<{ tableTypes: models.ITableType[] }>) => {
            const { tableTypes } = action.payload

            state.tableTypes = tableTypes
        }
    },
})

const { setLoading, addScoreToType, setTableTypes } = slice.actions
export { setLoading }

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getScoresAsync = (token: string, tableTypeId: string): AppThunk => async dispatch => {
    dispatch(setLoading(true))

    const scoresResponse = await client.getScoresThunkAsync(token, tableTypeId)

    dispatch(addScoreToType({ scoreType: tableTypeId, response: scoresResponse }))
    dispatch(setLoading(false))
}

export const getTableTypes = (token: string): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    const tableTypes = await client.getTableTypesThunkAsync(token)

    dispatch(setTableTypes({ tableTypes }))
    dispatch(setLoading(false))
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectScores = (state: RootState) =>
    state.scores

export default slice.reducer
