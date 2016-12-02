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
import Logo from './../../assets/img/Logo_Neat.png';
var styles = require('./styles');
import AuthService from '../../utilities/AuthService';
var Header = require('./../Header');
import t from 'tcomb-form-native';

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
      passwordAgain:"",
      errors: [],
      showProgress: false,
      success: false,
    }
  }



onRegisterPressed(){
    this.setState({showProgress: true});

 const value = this.refs.form.getValue();

  AuthService.register({
      password:  this.state.value.password,
      firstname: this.state.value.firstname,
      lastname:  this.state.value.lastname,
      email:     this.state.value.email,
      groups:    this.state.value.groups
  }, (results)=> {
     this.setState(Object.assign({showProgress: false}, results));
      if(results.success){
        console.log('you have register in');
        this.setState({
          value : {},success: false,badCredentials: false,unknownError: false
      })
      this.props.navigator.pop({id: 'Registration'});
      }else {
        console.log('error during registration: ', results);
      }
  });
}//End onRegisterPressed

  render() {
      let errorCtrl = <View />;
      /*console.log('state info: ', this.state.success, this.state.badCredentials,
      this.state.unknownError, this.state.value);*/

      if (!this.state.success && this.state.badCredentials) {
        errorCtrl = (<Text style={styles.error}>
          Please verify your information and try again!
        </Text>);
      }
      if (this.state.password != this.state.passwordAgain) {
          console.log("password: " + this.state.password);
          console.log("other password: " + this.state.password_confirmation);
        errorCtrl = (<Text style={styles.error}>
          Both passwords must match, please try again!
        </Text>);
      }
      if (!this.state.success && this.state.unknownError) {
        errorCtrl = (<Text style={styles.error}>
          We experienced an unexpected issue, try again!
        </Text>)
      }
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
        {errorCtrl}
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
