const graphql = require('graphql');
import user from '../schema/user';
import * as documentdb from 'documentdb';
import { Service as UsersService, IUser } from '../services/users';
import container from '../utilities/container'

export default {
    type: new graphql.GraphQLList(user),
    description: "Retrieve list of users",
    resolve: () => {
        const usersService = container.lookup<UsersService>('services:users')
        return usersService.getUsers();
    }
}