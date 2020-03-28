import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../../app/store'
import * as models from "../../types/models"
import { delay } from "../../utilities"
import * as options from "../../utilities/options"

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
    },
})

const { setLoading, addScoreToType } = slice.actions
export { setLoading }

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getScoresAsync = (): AppThunk => async dispatch => {
    dispatch(setLoading(true))

    await delay(1000)

    const scoresResponse: models.IScoresResponse = {
        scores: [
            {
                durationMilliseconds: 1234,
                endTime: '2134',
                id: '1232341231',
                sequence: [],
                startTime: '12312',
                tableLayout: {
                    expectedSequence: [],
                    height: 5,
                    width: 5,
                    id: 'z234123',
                    randomizedSequence: []
                },
                tableType: {
                    height: 5,
                    width: 5,
                    id: 'ww12312',
                    properties: []
                },
                user: {
                    name: 'Matt',
                    id: '1qw34q34'
                },
                userId: '123123',
            },
            {
                durationMilliseconds: 1234,
                endTime: '2134',
                id: 'aa1231',
                sequence: [],
                startTime: '12312',
                tableLayout: {
                    expectedSequence: [],
                    height: 5,
                    width: 5,
                    id: 'we123',
                    randomizedSequence: []
                },
                tableType: {
                    height: 5,
                    width: 5,
                    id: '12345a12312',
                    properties: []
                },
                user: {
                    name: 'Matt',
                    id: '1qw34q34'
                },
                userId: '123123',
            },
        ],
        users: [],
        continuationToken: null,
    }

    dispatch(addScoreToType({ scoreType: 'myType', response: scoresResponse }))
    dispatch(setLoading(false))
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectScores = (state: RootState) =>
    state.scores

export default slice.reducer
