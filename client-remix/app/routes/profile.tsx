import { UserButton, useUser } from "@clerk/remix"
import { getAuth } from "@clerk/remix/ssr.server"
import { LinksFunction, LoaderArgs, redirect } from "@remix-run/node"
import profileStyles from "~/styles/profile.css"

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: profileStyles },
]

export const loader = async (args: LoaderArgs) => {
  const { userId } = await getAuth(args)
  if (typeof userId !== 'string') {
    return redirect('/')
  }

  return null
}

export default function Profile() {
  const { user } = useUser()

  return (
    <>
      <h1>Profile</h1>
      <div className="profile">
        <img src={user?.imageUrl} alt="Profile Picture" className="profilePicture" />
        <UserButton afterSignOutUrl="/" />

        <div>
          <h2>{user?.username ?? user?.id}</h2>
          <p>{user?.emailAddresses.map(e => e.emailAddress).join(', ')}</p>
        </div>
        {/* <pre>
        <h3>ID Token:</h3>
        <code>{JSON.stringify(profile._json, null, 2)}</code>
      </pre> */}
      </div>
    </>
  )
}
