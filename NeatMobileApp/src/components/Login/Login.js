import React, { PropTypes } from 'react';
import t from 'tcomb-form-native';

let Form = t.form.Form;

let LoginInput = t.struct({
  username: t.String,
  password: t.String,
});

let options = {
  auto: 'placeholders',
  fields: {
    username: {
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      returnKeyType: 'next',
      error: 'Enter username',
    },
    password: {
      secureTextEntry: true,
      error: 'Enter password',
    },
  },
};
const Login = (props) => {
  return (
    <Form
      // ref="form"
      type={LoginInput}
      options={options}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

module.exports = Login;
