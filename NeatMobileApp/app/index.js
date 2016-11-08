import React, { Component } from 'react';
import AuthService from './utilities/AuthService';

import LoggedOut from './layouts/LoggedOut';
import LoggedIn from './layouts/LoggedIn';

class NeatMobileApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }
  componentWillMount() {
    AuthService.getLoginToken((err, authInfo) => {
      this.setState({
        isLoggedIn: authInfo != null,
        authInfo,
      });
    });
  }

  onLogin() {
    this.setState({ isLoggedIn: true });
  }

  render() {
    if (this.state.isLoggedIn) {
      return <LoggedIn onLogin={() => this.onLogin} />;
    }
    return <LoggedOut />;
  }
}

// NeatMobileApp.propTypes = {
//   status: React.PropTypes.object,
//   user: React.PropTypes.object,
//   loggingIn: React.PropTypes.bool,
// };

export default NeatMobileApp;
