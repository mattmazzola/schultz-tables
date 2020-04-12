const graphql = require('graphql');
import user from '../schema/user';
import * as documentdb from 'documentdb';
import { Service as UsersService, IUser } from '../services/users';
import container from '../utilities/container'

export default {
    type: user,
    description: "Find user by id",
    args: {
        userId: {
            type: graphql.GraphQLString
        }
    },
    resolve: async (value: any, { userId }: { userId: string }) => {
        const usersService = container.lookup<UsersService>('services:users')
        const user = await usersService.findUser(userId)

        if (!user) {
            throw new Error(`User with id ${userId} was not found.`)
        }

        return user
    }
}