export interface IGraphApiRespnse<T> {
    "odata.metadata": string
    value: T
}
export interface IGraphUser {
    displayName: string
    otherMails: string[]
    objectId: string
}