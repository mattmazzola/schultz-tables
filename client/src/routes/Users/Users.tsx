import * as React from 'react'
import * as RRD from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as Auth0 from "../../react-auth0-spa"
import { getUsersAsync, selectUsers } from './usersSlice'
import * as models from "../../types/models"
import './Users.css'

type Props = {
  loading: boolean
  users: models.IUser[]
}

const Users: React.FC<Props> = (props) => {
  return (
    <div className="users">
      {props.loading
        ? <div className="user">Loading...</div>
        : props.users.map(user =>
          <RRD.NavLink to={{ pathname: `/users`, state: { user } }} className="user" key={user.id}>
            <img src={user.picture} className="userImage" />
            <span>{user.nickname ?? user.name} {user.emailVerified === true && '✔ Verified'}</span>
          </RRD.NavLink>
        )}
    </div>
  )
}

const UsersContainer: React.FC = () => {
  const usersState = useSelector(selectUsers)
  const dispatch = useDispatch()
  const { getTokenSilently } = Auth0.useAuth0()

  React.useEffect(() => {
    async function fn() {
      const token = await getTokenSilently()
      dispatch(getUsersAsync(token))
    }

    if (usersState.users.length === 0) {
      fn()
    }
  }, [])

  return (
    <Users 
      loading={usersState.loading}
      users={usersState.users}
    />
  )
}

export default UsersContainer