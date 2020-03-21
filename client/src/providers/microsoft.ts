import { IProvider } from 'react-simple-auth'
import { guid } from '../services/utilities'

export interface IdToken {
    ver: string
    iss: string
    sub: string
    aud: string
    exp: number
    iat: number
    nbf: number
    name: string
    preferred_username: string
    oid: string
    tid: string
    at_hash: string
    nonce: string
    aio: string
}

export interface Session {
    accessToken: string
    idToken: string
    decodedIdToken: IdToken
}

export const microsoftProvider: IProvider<Session> = {
    /** Build url for Azure B2C tenant with FB sign in policy */
    buildAuthorizeUrl() {
        return `https://login.microsoftonline.com/schultztables.onmicrosoft.com/oauth2/v2.0/authorize
?response_type=id_token+token
&scope=${encodeURIComponent('openid https://schultztables.onmicrosoft.com/api/readwrite')}
&client_id=ccd73327-4b0e-4684-ba69-4838471bfa27
&redirect_uri=${window.location.origin}%2Fredirect.html
&response_mode=fragment
&state=${guid()}
&nonce=${guid()}
&p=B2C_1_signinfb
&client_info=1
&x-client-SKU=SCHULTZ
&x-client-Ver=1.0.0
&client-request-id=${guid()}
&domain_req=${guid()}
&login_req=${guid()}
&domain_hint=consumers
&prompt=login`
    },

    extractError(redirectUrl: string): Error | undefined {
        const errorMatch = redirectUrl.match(/error=([^&]+)/)
        if (!errorMatch) {
            return undefined
        }

        const errorReason = errorMatch[1]
        const errorDescriptionMatch = redirectUrl.match(/error_description=([^&]+)/)
        const errorDescription = errorDescriptionMatch ? errorDescriptionMatch[1] : ''
        return new Error(`Error during login. Reason: ${errorReason} Description: ${errorDescription}`)
    },

    extractSession(redirectUrl: string): Session {
        let accessToken: string = null!
        const accessTokenMatch = redirectUrl.match(/access_token=([^&]+)/)
        if (accessTokenMatch) {
            accessToken = accessTokenMatch[1]
        }

        let idToken: string = null!
        let decodedIdToken: IdToken = null!
        const idTokenMatch = redirectUrl.match(/id_token=([^&]+)/)
        if (idTokenMatch) {
            idToken = idTokenMatch[1]
            decodedIdToken = JSON.parse(atob(idToken.split('.')[1]))
        }

        return {
            accessToken,
            idToken,
            decodedIdToken
        }
    },

    validateSession(session: Session): boolean {
        const now = (new Date()).getTime()
        
        // With normal JWT tokens you can inspect the `exp` Expiration claim; however,
        // AAD V2 tokens are opaque and we must assume the expiration
        // Here we are leveraging the fact that the access token was issued at the same
        // time as the ID token and can use its `iat` Issued At claim
        const wellKnownTokenDuration = 1000 * 60 * 60
        const expiration = (session.decodedIdToken.iat * 1000) + wellKnownTokenDuration

        // 15 minutes minimum duration until token expires
        const minimumDuration = 1000 * 60 * 15
        return (expiration - now > minimumDuration)
    },

    getAccessToken(session: Session, resourceId: string): string {
        return session.accessToken
    },

    getSignOutUrl(redirectUrl: string): string {
        return `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}`
    }
}