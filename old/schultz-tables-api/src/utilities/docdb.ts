import * as docdb from 'documentdb';

export const getOrCreateDatabase = (client: docdb.DocumentClient, databaseId: string): Promise<docdb.DatabaseMeta> => {
    const querySpec: docdb.SqlQuerySpec = {
        query: 'SELECT * FROM root r WHERE r.id= @id',
        parameters: [
            {
                name: '@id',
                value: databaseId
            }
        ]
    };

    return new Promise<docdb.DatabaseMeta[]>((res, rej) => client.queryDatabases(querySpec).toArray((e, databases) => e ? rej(e) : res(databases)))
        .then(databases => {
            if (databases.length === 0) {
                const databaseSpec: any = {
                    id: databaseId
                }

                return new Promise<docdb.DatabaseMeta>((res, rej) => client.createDatabase(databaseSpec, (e, s) => e ? rej(e) : res(s)))
            }

            return databases[0]
        })
}

export const getOrCreateCollection = (client: docdb.DocumentClient, databaseLink: string, collectionId: string): Promise<docdb.CollectionMeta> => {
    const querySpec: docdb.SqlQuerySpec = {
        query: 'SELECT * FROM root r WHERE r.id= @id',
        parameters: [
            {
                name: '@id',
                value: collectionId
            }
        ]
    }

    return new Promise<docdb.CollectionMeta[]>((res, rej) => client.queryCollections(databaseLink, querySpec).toArray((e, s) => e ? rej(e) : res(s)))
        .then(collections => {
            if (collections.length === 0) {
                const collectionSpec = {
                    id: collectionId
                }

                return new Promise<docdb.CollectionMeta>((res, rej) => client.createCollection(databaseLink, collectionSpec, (e, s) => e ? rej(e) : res(s)))
            }

            return collections[0]
        })
}