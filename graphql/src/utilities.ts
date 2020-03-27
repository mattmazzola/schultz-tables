import * as types from './generated/types'
import crypto from 'crypto'
import dotent from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import jwksRsa from 'jwks-rsa'

import * as models from './models'

const result = dotent.config()
if (result.error) {
    console.error(result.error)
}

export function isTimeValid(
    serverStartTime: number,
    serverEndTime: number,
    scoreInput: types.ScoreInput,
    allowedDeviation: number): boolean {

    if (scoreInput.endTime < scoreInput.startTime) {
        return false
    }

    const startTimeSkew = Math.abs(serverStartTime - scoreInput.startTime)
    if (startTimeSkew > allowedDeviation) {
        return false
    }

    const endTimeSkew = Math.abs(serverEndTime - scoreInput.endTime)
    if (endTimeSkew > allowedDeviation) {
        return false
    }

    const durationDifference = (serverEndTime - serverStartTime) - (scoreInput.endTime - scoreInput.startTime)
    if (durationDifference > allowedDeviation) {
        return false
    }

    const anyAnwsersOutsideOfSubmissionRange = scoreInput.userSequence
        .map(s => s.time)
        .some(time => (time < scoreInput.startTime) || (time > scoreInput.endTime))

    if (anyAnwsersOutsideOfSubmissionRange) {
        return false
    }

    return true
}

export function sha256(s: string) {
    return crypto.createHash('sha256').update(s).digest('base64')
}

const algorithm = 'aes-256-ctr'
const encoding: crypto.Utf8AsciiBinaryEncoding = 'utf8'
const hex: crypto.HexBase64BinaryEncoding = 'hex'
const password: string = process.env.CIPHER_PASSWORD!

// make the key something other than a blank buffer
let key = Buffer.alloc(32)
key = Buffer.concat([Buffer.from(password)], key.length)

const iv = crypto.randomBytes(16)


export function encrypt(text: string): string {
    let cipher = crypto.createCipheriv(algorithm, key, iv)
    let crypted = cipher.update(text, encoding, hex)
    crypted += cipher.final(hex)
    return crypted
}

export function decrypt(text: string): string {
    let decipher = crypto.createDecipheriv(algorithm, key, iv)
    let dec = decipher.update(text, hex, encoding)
    dec += decipher.final(encoding)
    return dec
}

interface IKey {
    kid: string
    nbf: number
    use: string
    kty: string
    e: string
    n: string
    x5t: string
    x5c: string[]
}

const client = jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`
})

// https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-tokens#token-validation
// https://github.com/rzcoder/node-rsa/issues/43
export async function getCertificate(): Promise<string> {
    const keys = await getKeys()

    // https://github.com/nearform/fastify-auth0-verify/blob/master/index.js#L103
    const key = keys[0].x5c[0]
    const publicKey = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----\n`

    return publicKey
}

async function getKeys(): Promise<IKey[]> {
    return new Promise((res, rej) => {
        client.getKeys((error, keys) => {
            if (error) {
                rej(error)
            }

            res(keys as IKey[])
        })
    })
}

// https://github.com/auth0/node-jsonwebtoken
export async function getJwt(authorization: string, publicKey: string, options: { issuer: string, audience: string }): Promise<object> {
    const tokenType = 'Bearer'
    const jwt = authorization && authorization.startsWith(tokenType)
        ? authorization.slice(`${tokenType} `.length)
        : undefined

    if (!jwt) {
        throw new Error(`Authorization did not contain a ${tokenType} JWT.`)
    }

    let decodedJwt: object

    try {
        decodedJwt = await new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, publicKey, { ...options, algorithms: ['RS256'] }, (error: Error, decoded: any) => {
                if (error) {
                    rej(error)
                    return
                }

                res(decoded)
            })
        })
    }
    catch (e) {
        const error = e as Error
        throw new Error(`Authorization header did not contain a valid JWT.\n ${error}`)
    }

    return decodedJwt
}
