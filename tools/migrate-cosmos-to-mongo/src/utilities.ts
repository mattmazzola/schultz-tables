import * as models from './models'

export function convertCosmosTableLayoutToMongo(cosmosModel: models.cosmos.ITableLayout): models.mongo.ITableLayout {
    const { id, width, height, expectedSequence, randomizedSequence, ...rest } = cosmosModel

    return {
        id,
        width,
        height,
        expectedSequence,
        randomizedSequence,
    }
}

export function convertCosmosTableTypeToMongo(cosmosModel: models.cosmos.ITableType): models.mongo.ITableType {
    const { id, width, height, properties, ...rest } = cosmosModel

    return {
        id,
        width,
        height,
        properties: properties.map(kv => ({ key: kv.Key, value: kv.Value })),
    }
}

function convertIsoTimeToNumber (isoString: string): number {
    return new Date(isoString).getTime()
}

export function convertCosmosScoreToMongo(cosmosModel: models.cosmos.IScore): models.mongo.IScore {
    const anyModel: any = cosmosModel
    const { _rid, _self, _etag, _attachments, _ts, ...model } = anyModel

    const typedModel: models.cosmos.IScore = model
    const sequence = typedModel.sequence.map(s => {
        return {
            time: convertIsoTimeToNumber(s.time),
            correct: s.correct,
            cell: {
                classes: [],
                text: s.cell.text,
                x: s.cell.x,
                y: s.cell.y,
            }
        }
    })


    return {
        id: typedModel.id,
        sequence,
        tableLayoutId: typedModel.tableLayoutId,
        tableTypeId: typedModel.tableTypeId,
        startTime: convertIsoTimeToNumber(typedModel.startTime),
        endTime: convertIsoTimeToNumber(typedModel.endTime),
        duration: typedModel.durationMilliseconds,
        durationMilliseconds: typedModel.durationMilliseconds,
        userId: typedModel.userId
    }
}