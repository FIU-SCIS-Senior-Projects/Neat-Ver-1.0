import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
// import Meteor, { Accounts } from 'react-native-meteor';
import SignIn from './SignIn';
import AuthService from '../../utilities/AuthService';
import Routes from '../../config/routes';

class SignInContainer extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      confirmPasswordVisible: false,
      error: null,
    };
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleError(error) {
    if (this.mounted) {
      this.setState({ error });
    }
  }

  validInput(overrideConfirm) {
    const { username, password, confirmPassword, confirmPasswordVisible } = this.state;
    let valid = true;

    if (username.length === 0 || password.length === 0) {
      this.handleError('Email and password cannot be empty.');
      valid = false;
    }

    if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
      this.handleError('Passwords do not match.');
      valid = false;
    }

    if (valid) {
      this.handleError(null);
    }

    return valid;
  }

  handleSignIn() {
    if (this.validInput(true)) {
      const { username, password } = this.state;
      // Meteor.loginWithPassword(email, password, (err) => {
      //   if (err) {
      //     this.handleError(err.reason);
      //   }
      // });
      AuthService.login({ username, password }, (results) => {
        console.log('from login', results);
        if (results.success) {
          this.props.navigator.push(Routes.getAssignmentsRoute());
        } else {
          this.handleError('error during login: ', results.status);
        }
      });
    }
  }

  handleCreateAccount() {
    const { username, password, confirmPasswordVisible } = this.state;

    if (confirmPasswordVisible && this.validInput()) {
      AuthService.createUser({ username, password }, (err) => {
        if (err) {
          this.handleError(err.reason);
        } else {
          // hack because react-native-meteor doesn't login right away after sign in
          this.handleSignIn();
        }
      });
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState({ confirmPasswordVisible: true });
    }
  }

  render() {
    return (
      <SignIn
        updateState={this.setState.bind(this)}
        signIn={this.handleSignIn.bind(this)}
        createAccount={this.handleCreateAccount.bind(this)}
        {...this.state}
      />
    );
  }
}

SignInContainer.propTypes = {
  navigator: React.PropTypes.object,
};

export default SignInContainer;
