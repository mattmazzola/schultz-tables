import * as React from 'react'
import * as RRD from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
        : props.users.map((user: any) =>
          <RRD.NavLink to={{ pathname: `/users/${user.id}`, state: { user } }} className="user" key={user.id}>
            <span><i className="icon-person material-icons">person</i></span>
            <span>{user.name}</span>
          </RRD.NavLink>
        )}
    </div>
  )
}

const UsersContainer: React.FC = () => {
  const usersState = useSelector(selectUsers)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getUsersAsync())
  }, [])

  return (
    <Users 
      loading={usersState.loading}
      users={usersState.users}
    />
  )
}

export default UsersContainer