import * as types from '../../generated/types'
import auth0ManagementClient from "../../services/auth0service"

const Query: types.QueryResolvers.Resolvers = {
    users: async () => {
        const users = await auth0ManagementClient.getUsers()

        return users.map<types.User>(user => {
            return {
                id: user.user_id ?? 'unknown',
                email: user.email ?? 'unknown',
                emailVerified:  user.email_verified ?? false,
                name: user.name ?? 'unknown',
                nickname: user.nickname ?? 'unknown',
                picture: user.picture ?? 'https://via.placeholder.com/60'
            }
        })
    }
}

export default {
    Query
}