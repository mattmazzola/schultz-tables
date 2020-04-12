const graphql = require('graphql');

export const User = new graphql.GraphQLObjectType({
  name: "User",
  description: "User of Schultz Table App",
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString }
  })
});

export default User;