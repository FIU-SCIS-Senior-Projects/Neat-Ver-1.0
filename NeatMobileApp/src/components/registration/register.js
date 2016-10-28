'use strict'
/**
 * NEAT
 *Nelson Cruz
 *register.js
 */

import React, { Component } from 'react';
import { AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Image } from 'react-native';
//import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//var CONFIG = require('./../../config.js');
var styles = require('./styles');
var authService = require('../../utilities/AuthService');
var Header = require('./../Header');
var t = require('tcomb-form-native');
var Form = t.form.Form;
var RegisterForm = t.struct({
  firstname:     t.String,
  lastname:      t.String,
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

class Register extends Component {
  constructor(props){
    super(props);

    this.state = {
      value: {
      },
      password: "",
      firstname: "",
      lastname: "",
      groups: [],
      email: "",
      password_confirmation: "",
      errors: [],
      showProgress: false,
      success: false,
    }
  }



onRegisterPressed(){
    this.setState({showProgress: true});

 const value = this.refs.form.getValue();

  authService.register({
      password:  value.password,
      firstname: value.firstname,
      lastname:  value.lastname,
      email:     value.email,
      groups:    value.groups
  }, (results)=> {

      this.setState(Object.assign({
          showProgress: false
      }, results));

      if(results.success){
          console.log('This is the result: ' + results.success);
        this.props.navigator.push({
          id: 'Login'
        });
        console.log('you have register in');
        this.setState({
          value : {},
          success: false,
          badCredentials: false,
          unknownError: false
        })
      }else {
        console.log('error during registration: ', results);
      }
  });
}//End onRegisterPressed

  render() {
    return (
      <View style={styles.container}>
        <Header
          showProgress={false}
        />
        <View style={styles.inputs, styles.inputContainer}>
          <Form
            ref="form"
            type={RegisterForm}
            options={options}
            value={this.state.value}
            onChange={(value) => this.setState({value})}
          />
        </View>
        <TouchableHighlight style = {styles.button}
        onPress={this.onRegisterPressed.bind(this)} >
          <Text style = {styles.buttonText}>
            Register
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

//Thisplays the errors if any
const Errors = (props) => {
  return (
    <View>
    {props.errors.map((error,i) => <Text key={i} style = {styles.error}>{error}</Text>)}
    </View>
  );
}
export default Register;
