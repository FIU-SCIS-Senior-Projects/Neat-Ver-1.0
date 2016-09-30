/**
 * # Login.js
 *
 *  The container to display the Login form
 *
 */
'use strict'
/**
 *   LoginRender
 */
import LoginRender from '../components/LoginRender'

/**
 * The necessary React components
 */
import React from 'react'

function buttonPressHandler (login, username, password) {
  login(username, password)
}

let Login = React.createClass({

  render () {
    let onButtonPress = buttonPressHandler.bind(null,
                                                this.props.actions.login,
                                                this.props.auth.form.fields.username,
                                                this.props.auth.form.fields.password
                                               )

    return (
      <LoginRender
        formType={LOGIN}
        loginButtonText={loginButtonText}
        onButtonPress={onButtonPress}
        displayPasswordCheckbox
        leftMessageType={REGISTER}
        rightMessageType={FORGOT_PASSWORD}
        auth={this.props.auth}
        global={this.props.global}
      />
    )
  }
})

export default Login;
