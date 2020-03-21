import RSA from 'react-simple-auth'
import { microsoftProvider } from '../providers/microsoft'
export const baseUrl: string = process.env.REACT_APP_BASE_URL!

export const makeGraphqlRequest = async (operationName: string | null, query: string) => {
    return await fetch(baseUrl, {
        "credentials": "omit",
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,ko;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            'Authorization': `Bearer ${RSA.getAccessToken(microsoftProvider, '')}`,
        },
        "body": JSON.stringify({
            operationName,
            variables:{},
            query
        }),
        "method": "POST",
        "mode": "cors"
    })
}

export const makeGraphqlMutation = async (operationName: string, mutation: string) => {
    return await fetch(baseUrl, {
        "credentials": "omit",
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,ko;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            'Authorization': `Bearer ${RSA.getAccessToken(microsoftProvider, '')}`,
        },
        "body": JSON.stringify({
            operationName,
            variables:{},
            query: mutation
        }),
        "method": "POST",
        "mode": "cors"
    })
}