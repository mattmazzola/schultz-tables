import { ApolloServer } from 'apollo-server'
import context, { getDb } from './context'
import schema from './schema'
import { getCertificate } from './utilities'

{
  (async () => {
    const audience = process.env.AUDIENCE!
    const issuer = process.env.ISSUER!
    const publicKey = await getCertificate()
    const db = await getDb()
    const server = new ApolloServer({
      schema,
      engine: {
        apiKey: process.env.ENGINE_API_KEY,
      },
      introspection: true,
      playground: true,
      context: ({ req }: any) => context({ req }, db, publicKey, { audience, issuer }, process.env.PLAYGROUND_SECRET!),
    })

    const port = process.env.PORT || 4000
    const serverInfo = await server.listen(port)
    const { url } = serverInfo
    console.log(`🚀  Server ready at ${url} `);
  })()
}
