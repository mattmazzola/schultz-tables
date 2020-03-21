import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { login } from '../actions'
import { ReduxState } from '../types'
import RSA from 'react-simple-auth'
import { microsoftProvider } from '../providers/microsoft'
import './Login.css'
import { Dispatch } from 'redux';

const Login: React.FC<Props> = ({ login }) => {
    async function onClickLogin() {
        try {
            const session = await RSA.acquireTokenAsync(microsoftProvider)
            login(session.decodedIdToken.oid, session.decodedIdToken.name)
        } catch (error) {
            throw error
        }
    }

    return (
        <div className="login-page">
            <button className="login-button" type="button" onClick={() => onClickLogin()}>Login with Facebook</button>
        </div>
    )
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return bindActionCreators({
        login
    }, dispatch)
}
const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user
    }
}

type stateProps = ReturnType<typeof mapStateToProps>
type dispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = stateProps & dispatchProps

export default connect<stateProps, dispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Login);
