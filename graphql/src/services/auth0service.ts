import dotent from 'dotenv'
import auth0 from "auth0"

const result = dotent.config()
if (result.error) {
    console.error(result.error)
}

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN!,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

export default managementClient