import * as cosmos from "@azure/cosmos"
import dotent from 'dotenv'
import { MongoClient } from 'mongodb'
import * as models from './models'
import * as utilities from './utilities'
import * as crypto from 'crypto'
import stringify from 'json-stable-stringify'

const result = dotent.config()
if (result.error) {
    console.error(result.error)
}

const CosmosClient = cosmos.CosmosClient
const endpoint = "https://schultz-tables.documents.azure.com:443/"
const masterKey = process.env.COSMOS_MASTER_KEY!
const client = new CosmosClient({ endpoint, auth: { masterKey } })

const connectionString = process.env.MONGO_CONNECTION_STRING!
const dbName = `schultztables`
const mongoClient = new MongoClient(connectionString, { useNewUrlParser: true });

export function sha256(s: string) {
    return crypto.createHash('sha256').update(s).digest('base64')
}

async function main() {
    const mClient = await mongoClient.connect()
    const db = mClient.db(dbName)
    const mongo = {
        scores: db.collection<models.mongo.IScore>('scores'),
        tableTypes: db.collection<models.mongo.ITableType>('tabletypes'),
        tableLayouts: db.collection<models.mongo.ITableLayout>('tablelayouts'),
    }

    const database = client.database('schultztable')

    const cursor = await mongo.tableTypes.find()
    const tableLayouts = await cursor.toArray()

    console.log(tableLayouts.length)

    const tlStrings = tableLayouts
        .sort((a, b) => a.width - b.width)
        .map((tl, i) => {
            const tempTableType = { ...tl }
            delete tempTableType.id
            delete (tempTableType as any)._id
            if (i === 0) {
                console.log({ tl, tempTableType })
            }
            const propertiesString = tempTableType.properties.sort((a, b) => a.key.localeCompare(b.key)).map(p => `${p.key}: ${p.value}`).join(', ');
            const stringified = `${tl.width} ${tl.height} ${propertiesString}`
            const hash = sha256(stringified)

            return `${i.toString().padStart(2)}: ${tl.id} ${tl.width} ${tl.height} ${propertiesString}
    ${hash}`
        })

    console.log(tlStrings.join('\n'))

    // console.log('Table Layouts')
    // const tableLayouts = await database.container('tablelayouts').items.readAll<models.cosmos.ITableLayout>().toArray()
    // const tableLayoutsArray = (tableLayouts.result || [])
    //     // .filter((_, i) => i < 2)
    //     .map(tl => utilities.convertCosmosTableLayoutToMongo(tl))

    // for (const tableLayout of tableLayoutsArray) {
    //     await mongo.tableLayouts.updateOne({ id: tableLayout.id }, { $set: tableLayout }, { upsert: true })
    //     console.log(`tableLayout: ${tableLayout.id} ${tableLayout.height}`)
    // }

    // console.log('Table Types')
    // const tableTypes = await database.container('tabletypes').items.readAll<models.cosmos.ITableType>().toArray()
    // const tableTypesArray = (tableTypes.result || [])
    //     // .filter((_, i) => i < 2)
    //     .map(tt => utilities.convertCosmosTableTypeToMongo(tt))

    // for (const tableType of tableTypesArray) {
    //     await mongo.tableTypes.updateOne({ id: tableType.id }, { $set: tableType }, { upsert: true })
    //     console.log(`tabletype.updateOne(${tableType.id})`)
    // }

    // console.log('Scores')
    // const scores = await database.container('scores').items.readAll<models.cosmos.IScore>().toArray()
    // const scoresArray = (scores.result || [])
    //     // .filter((_, i) => i < 2)
    //     .map(s => utilities.convertCosmosScoreToMongo(s))

    // for (const score of scoresArray) {
    //     await mongo.scores.updateOne({ id: score.id }, { $set: score }, { upsert: true })
    //     console.log(`score: ${score.id} ${score.userId} ${score.duration}`)
    // }
}

main()
    .catch(err => {
        console.error(err)
    })
    .then(() => {
        process.exit()
    })
