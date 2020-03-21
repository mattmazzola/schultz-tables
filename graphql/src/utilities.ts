import * as types from './generated/types'
import crypto from 'crypto'
import dotent from 'dotenv'
import fetch from 'node-fetch'
import jsonwebtoken from 'jsonwebtoken'
import getPem from 'rsa-pem-from-mod-exp'
import adal from 'adal-node'
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

export function encrypt(text: string): string {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, encoding, hex)
    crypted += cipher.final(hex)
    return crypted
}

export function decrypt(text: string): string {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, hex, encoding)
    dec += decipher.final(encoding)
    return dec
}



interface IKeyResponse {
    keys: IKey[]
}
interface IKey {
    kid: string
    nbf: number
    use: string
    kty: string
    e: string
    n: string
}
// https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-tokens#token-validation
// https://github.com/rzcoder/node-rsa/issues/43
export async function getCertificate(): Promise<string> {
    const response = await fetch(`https://login.microsoftonline.com/schultztables.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_signinfb`)
    if (!response.ok) {
        throw new Error(`Could not get public for token verification: ${response.statusText}`)
    }

    const keysResponse: IKeyResponse = await response.json()
    const key = keysResponse.keys[0]
    const publicKey = getPem(key.n, key.e)

    return publicKey as string
}

// https://github.com/auth0/node-jsonwebtoken
export async function getJwt(authorization: string, audience: string, publicKey: string): Promise<object> {
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
            jsonwebtoken.verify(jwt, publicKey, { audience, algorithms: ['RS256'] }, (error: Error, decoded: any) => {
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




const authenticationContext = new adal.AuthenticationContext(`https://login.microsoftonline.com/${process.env.AAD_TENANT}`)

export async function acqureAadToken(): Promise<adal.TokenResponse> {
    const token = await new Promise<adal.TokenResponse | adal.ErrorResponse>((res, rej) => {
        authenticationContext.acquireTokenWithClientCredentials(`https://graph.windows.net`, process.env.AAD_APPLICATION_ID!, process.env.AAD_APPLICATION_KEY!, (err, tokenResponse) => {
            if (err) {
                rej(err)
                return
            }

            res(tokenResponse)
            return
        })
    })

    if (token.error) {
        throw new Error(`${token.error} ${token.errorDescription}`)
    }

    const tokenResponse: adal.TokenResponse = token as any

    return tokenResponse
}

export async function getUsersByIds (userIds: string[], accessToken: string): Promise<models.IGraphApiRespnse<models.IGraphUser[]>> {
    const response = await fetch(`https://graph.windows.net/${process.env.AAD_TENANT}/getObjectsByObjectIds?api-version=1.6`, {
        method: "POST",
        body: JSON.stringify({
            objectIds: userIds,
            types: ["user"]
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    const graphUsers: models.IGraphApiRespnse<models.IGraphUser[]> = await response.json()

    return graphUsers
}