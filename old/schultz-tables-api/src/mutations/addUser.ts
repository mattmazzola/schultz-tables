const { graphql } = require('graphql');
import User from '../schema/user';
import UserInput from '../schema/userInput';
import { default as UsersService, IUser } from '../services/users';
import container from '../utilities/container'

export default {
    type: User,
    description: "Add user",
    args: {
        user: {
            type: UserInput
        }
    },
    resolve: (value: any, { user }: { user: any }) => {
        const usersService = container.lookup<UsersService>('services:users')
        return usersService.addUser(user);
    }
}