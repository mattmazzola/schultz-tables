const graphql = require('graphql');

export const UserInput = new graphql.GraphQLInputObjectType({
  name: "UserInput",
  description: "User of Schultz Table App",
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString }
  })
});

export default UserInput;