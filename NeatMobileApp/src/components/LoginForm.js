'use strict'

import React, { PropTypes, Component } from 'react';

var t = require('tcomb-form-native');
var Form = t.form.Form;

var LoginFormInput = t.struct({
  username: t.String,
  password: t.String,
});

var options = {
  auto: 'placeholders',
  fields: {
    username: {
      autoCapitalize: 'none',
      error: 'Enter username'
    },
    password: {
      secureTextEntry: true,
      error: 'Enter password'
    },
  }
}

class LoginForm extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Form
        ref="form"
        type={LoginFormInput}
        options={options}
        value={this.props.value}
        onChange={this.props.onChange}
        />
    )
  }
}

module.exports = LoginForm;
