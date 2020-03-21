import * as types from '../../generated/types'

const Query: types.QueryResolvers.Resolvers = {
    tableLayouts: async (_, args, context, info) => {
      const cursor = await context.tableLayouts.find()
      const tableLayouts = await cursor.toArray()

      return tableLayouts
    }
}

export default {
    Query
}