import * as React from 'react'
import { NavLink } from 'react-router-dom'

const component: React.FC = () => {
    if (window.location.href.length > 0) {
        // Get name of window which was set by the parent to be the unique request key
        const requestKey = window.name
        // Update corresponding entry with the redirected url which should contain either access token or failure reason in the query parameter / hash
        window.localStorage.setItem(requestKey, window.location.href)
        window.close()
    }

    return (
        <div>
            <div>
                404 Not Found
            </div>
            <div>
                <NavLink to="/">Home</NavLink>
            </div>
        </div>
    )
}

export default component