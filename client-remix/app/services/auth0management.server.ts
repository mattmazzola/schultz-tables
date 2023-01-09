import { ManagementClient } from 'auth0'
import { AUTH0_DOMAIN, AUTH0_MANAGMENT_TOKEN } from '~/constants/index.server'

export const managementClient = new ManagementClient({
    token: AUTH0_MANAGMENT_TOKEN,
    domain: AUTH0_DOMAIN,
})