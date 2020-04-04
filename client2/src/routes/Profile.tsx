import React from "react"
import * as Auth0 from "../react-auth0-spa"
import styles from "./Profile.module.css"

const Profile: React.FC = () => {
    const { loading, user, isAuthenticated, logout, loginWithRedirect } = Auth0.useAuth0()

    if (loading || !user) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.profile}>
            <img src={user.picture} alt="Profile Picture" className={styles.profilePicture} />

            <div>
                <button onClick={() => logout()}  className={styles.profileLogOutButton}>Log out</button>
            </div>

            <div>
                <h2>{user.nickname ?? user.name}</h2>
                <p>{user.email}</p>
            </div>

            <div>
                <h3>ID Token:</h3>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
        </div>
    )
}

export default Profile