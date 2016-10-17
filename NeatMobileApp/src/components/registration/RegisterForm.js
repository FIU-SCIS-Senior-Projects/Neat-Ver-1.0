'use strict'

import React, { PropTypes, Component } from 'react';

var t = require('tcomb-form-native');
var Form = t.form.Form;

var RegisterFormInput = t.struct({
  firstname:     t.String,
  lastname:      t.String,
  username:      t.String,
  email:         t.String,
  password:      t.String,
  passwordAgain: t.String,
});

var options = {
  auto: 'placeholders',
  fields: {
    first_name: {
      autoCapitalize: 'first',
     // error: 'Enter First Name'
    },
    Last_name: {
      autoCapitalize: 'first',
     // error: 'Enter Last Name'
    },
    email: {
      autoCapitalize: 'none',
      keyboardType: 'email-address',
    },
    username: {
      autoCapitalize: 'none',
      //error: 'Enter username'
    },
    password: {
      secureTextEntry: true,
     // error: 'Enter password'
    },
    passwordAgain: {
      secureTextEntry: true,
      //error: 'Enter password'
    },
  }
}

class RegisterForm extends Component {
  constructor(props){
    super(props)
}
var value = RegisterForm.refs.form.getValue();
    render(){
        return(
            <Form
              ref="form"
              type={RegisterFormInput}
              options={options}
              value={this.props.value}
              onChange={(value) => this.setState({value})}
            />
        )
    }
  }

  module.exports = RegisterForm;
