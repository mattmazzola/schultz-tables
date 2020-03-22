import React from "react"
import * as Auth0 from "../react-auth0-spa"

const Profile: React.FC = () => {
    const { loading, user, isAuthenticated, logout, loginWithRedirect } = Auth0.useAuth0()

    if (loading || !user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <img src={user.picture} alt="Profile" />

            <div>
                {isAuthenticated
                    ? <button onClick={() => logout()}>Log out</button>
                    : <button onClick={() => loginWithRedirect({})}>Log in</button>}
            </div>

            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <h3>ID Token:</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
    )
}

export default Profile