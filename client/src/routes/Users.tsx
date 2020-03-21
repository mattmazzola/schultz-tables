import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Query } from "react-apollo"
import gql from "graphql-tag"
import './Users.css'

class Users extends React.Component {
  render() {
    return (
      <Query
        query={gql`
{
    users {
        id
        email
        name
    }
}
  `}
      >
        {({ loading, error, data }: any) => {
          if (error) {
            return <div>{error.message}</div>
          }

          return (
            <div className="users">
              {loading
                ? <div className="user">Loading...</div>
                : data.users.map((user: any) =>
                  <NavLink to={{ pathname: `/users/${user.id}`, state: { user } }} exact={true} className="user" key={user.id}>
                    <span><i className="icon-person material-icons">person</i></span>
                    <span>{user.name}</span>
                  </NavLink>
                )}
            </div>
          )
        }}
      </Query>
    );
  }
}

export default Users