import * as types from '../../generated/types'

const Query: types.QueryResolvers.Resolvers = {
    tableTypes: async (_, args, context, info) => {
      const cursor = await context.tableTypes.find()
      const tableLayouts = await cursor.toArray()

      return tableLayouts
    }
}

export default {
    Query
}