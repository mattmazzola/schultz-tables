import { ManagementClient } from 'auth0'
import { AUTH0_DOMAIN, AUTH0_MANAGEMENT_TOKEN } from '~/constants/index.server'

export const managementClient = new ManagementClient({
    token: AUTH0_MANAGEMENT_TOKEN,
    domain: AUTH0_DOMAIN,
})