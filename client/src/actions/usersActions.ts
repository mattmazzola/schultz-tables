import { ActionObject } from '../types'
import { AT } from '../types/ActionTypes'
import * as models from '../types/models'
import { ThunkAction } from 'redux-thunk'
import { makeGraphqlRequest } from '../services/graphql'

export const getUsersAsync = (): ActionObject =>
    ({
        type: AT.GET_USERS_ASYNC
    })

export const getUsersFulfilled = (users: models.IUser[]): ActionObject => 
    ({
        type: AT.GET_USERS_FULFILLED,
        users
    })

export const getUsersRejected = (reason: string): ActionObject => 
    ({
        type: AT.GET_USERS_REJECTED,
        reason
    })

export const getUsersThunkAsync = (): ThunkAction<any, any, any, ActionObject> => {
    return async (dispatch) => {
        try {
            // const response = await fetch(`${baseUri}/api/users`, {
            //     method: 'GET',
            //     headers: {
            //         'Accept': 'application/json',
            //         'Authorization': `Bearer ${RSA.getAccessToken(microsoftProvider, '')}`
            //     }
            // });

            const response = await makeGraphqlRequest(
                null,
                `{
                    users {
                        id
                        email
                        name
                    }
                }`)

            if (!response.ok) {
                console.log(`status test: `, response.statusText)
                const text = await response.text()
                throw new Error(text)
            }

            const json: models.IGraphQlResponse<{ users: models.IUser[] }> = await response.json();
            if (json.errors && json.errors.length >= 1) {
                throw new Error(json.errors[0].message)
            }

            const users = json.data.users
            dispatch(getUsersFulfilled(users));
        }
        catch (error) {
            console.error(error);
            dispatch(getUsersRejected(error));
        }
    }
}