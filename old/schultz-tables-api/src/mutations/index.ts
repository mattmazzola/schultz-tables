const graphql = require('graphql');
import addUser from './addUser';

export const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  description: "Root of all mutations for Schultz Tables API",
  fields: () => ({
    addUser
  })
});
