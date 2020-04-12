import * as express from 'express';
import * as cors from 'cors';
import * as graphqlHttp from 'express-graphql';
import { query } from './queries';
import { mutation } from './mutations';
import * as dotenv from 'dotenv';
import * as documentdb from 'documentdb';
import * as docdbUtil from './utilities/docdb';
import UsersService from './services/users';
import container from './utilities/container'

dotenv.config()

const documentDbClient = new documentdb.DocumentClient(process.env.AZURE_DOCUMENTDB_HOST, {
  masterKey: process.env.AZURE_DOCUMENTDB_PRIMARY_KEY
})

async function main() {
  // Provision required database and collections if they do not exist
  const database = await docdbUtil.getOrCreateDatabase(documentDbClient, "schultztable")
  const collection = await docdbUtil.getOrCreateCollection(documentDbClient, database._self, "users")

  container.register('docdbclient', documentDbClient)

  const usersService = new UsersService(documentDbClient, database, collection)
  container.register('services:users', usersService)

  const graphql = require('graphql');
  const schema = new graphql.GraphQLSchema({
    query,
    mutation
  });

  const app = express();

  app.use(cors());

  app.use((req, res, next) => {
    res.setHeader('x-request-id', 'OThkMTMwNWU3N2JlNWM2NDNiNzA1NWUyYTQ5Y2EyMTgwZmQxYjU1ZWU1MmQyYjBmMjc0MmNkMDFlYzNmZWJiYQ==');
    if (next) next();
  });

  app.use('/graphql', graphqlHttp({
    schema,
    graphiql: true,
    pretty: true,
    formatError: (error: any) => {
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        source: error.source
      };
    }
  }));

  app.get('/', (req, res) => {
    res.status(200).send("GraphQL server running...");
  });

  const port = process.env.PORT || 4001;

  console.log(`GraphQL started on port: ${port}`);
  app.listen(port);
}

main()