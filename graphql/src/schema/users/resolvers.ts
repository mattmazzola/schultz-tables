import * as types from '../../generated/types'
import auth0ManagementClient from "../../services/auth0service"

const Query: types.QueryResolvers.Resolvers = {
    users: async () => {
        const users = await auth0ManagementClient.getUsers()

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