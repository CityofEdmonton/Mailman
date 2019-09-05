import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { fetchLogin } from '../actions/Login'

const styles = theme => ({
  largeButton: {
    width: 50,
    height: 50,
  },
  place: {
    position: 'absolute',
    bottom: -500,
  },
})

const Login = props => (
  <div>
    <h1>Login</h1>

    <p>This is a simple example of a React component.</p>

    <p>
      Current user: <strong>{JSON.stringify(props.user)}</strong>
    </p>

    <button onClick={props.fetchLogin.bind(this, props.signalrId)}>Login</button>
  </div>
)

const mapStateToProps = state => {
  return {
    user: state.login.user,
    signalrId: state.login.signalrId
  }
}

const mapDispatchToProps = {
  fetchLogin
}
const exportWithStyles = withStyles(styles, { withTheme: true })(Login)

export default connect(mapStateToProps, mapDispatchToProps)(exportWithStyles)