import adal from 'adal-node'
import fetch from 'node-fetch'
import * as models from '../../models'
import dotent from 'dotenv'
import * as types from '../../generated/types'

const result = dotent.config()
if (result.error) {
  console.error(result.error)
}

const Query: types.QueryResolvers.Resolvers = {
    users: async () => {
        const authenticationContext = new adal.AuthenticationContext(`https://login.microsoftonline.com/${process.env.AAD_TENANT}`)

        const token = await new Promise<adal.TokenResponse | adal.ErrorResponse>((res, rej) => {
            authenticationContext.acquireTokenWithClientCredentials(`https://graph.windows.net`, process.env.AAD_APPLICATION_ID!, process.env.AAD_APPLICATION_KEY!, (err, tokenResponse) => {
                if (err) {
                    rej(err)
                    return
                }

                res(tokenResponse)
                return
            })
        })

        if (token.error) {
            throw token.error
        }

        const tokenResponse: adal.TokenResponse = token as any

        const response = await fetch(`https://graph.windows.net/${process.env.AAD_TENANT!}/users?api-version=1.6`, {
            headers: {
                'Authorization': `Bearer ${tokenResponse.accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const graphUsers: models.IGraphApiRespnse<models.IGraphUser[]> = await response.json()

        return graphUsers.value.map<types.User>(gu => ({
            id: gu.objectId,
            email: gu.otherMails[0] || '',
            name: gu.displayName
        }))
    }
}

export default {
    Query
}