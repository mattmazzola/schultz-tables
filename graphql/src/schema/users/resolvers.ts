import dotent from 'dotenv'
import * as types from '../../generated/types'
import auth0 from "auth0"

const result = dotent.config()
if (result.error) {
    console.error(result.error)
}

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN!,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

const Query: types.QueryResolvers.Resolvers = {
    users: async () => {
        const users = await managementClient.getUsers()

        return users.map<types.User>(user => {
            return {
                id: user.user_id ?? 'unknown',
                email: user.email ?? 'unknown',
                name: user.name ?? 'unknown',
            }
        })
    }
}

export default {
    Query
}