import dotenv from "dotenv"
import auth0 from "auth0"

process.on('unhandledRejection', (reason) => {
    throw reason
})

const result = dotenv.config()
if (result.error) {
    throw result.error
}

console.log(result.parsed)

const managementClient = new auth0.ManagementClient({
    domain: process.env.DOMAIN!,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

async function main() {
    const users = await managementClient.getUsers()

    console.log({ users })

    console.log('asdfasdf')
}

main()








