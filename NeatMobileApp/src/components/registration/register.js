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
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//const userIcon = (<Icon name="fa-user" size={25} color ={'#900'}/>)

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

  var value = this.refs.form.getValue();

  authService.register({
      //username:  this.state.value.username,
      password:  this.state.value.password,
      firstname: this.state.value.firstname,
      lastname:  this.state.value.lastname,
      email:     this.state.value.email,
      groups:   this.state.value.groups
  }, (results)=> {
      this.setState(Object.assign({
          showProgress: false
      }, results));
      if(results.success){
        //this.props.navigator.pop();
        this.props.navigator.push({
          id: 'StudentDashboard'
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
        {/*
        <View style={styles.registerForgotContainer}>
          <View style={styles.registerContainer}>
            <Text
              style={styles.greyFont}
              onPress={() => this.props.navigator.pop()}>
              Already have an account
            </Text>
          </View>
          <TouchableHighlight style={styles.forgotContainer}>
            <Text style={styles.greyFont} >Forgot?</Text>
          </TouchableHighlight>
        </View>
        */}

        <TouchableHighlight style = {styles.button} onPress={this.onRegisterPressed.bind(this)} >
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

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#FFF',
      padding: 35,
      flex: 1,
    },
    logo: {
      alignSelf: 'center',
      width: 175,
      height: 175,
    },
    heading: {
      fontSize: 65,
      fontWeight: '300',
      alignSelf: 'center',
    },
    button: {
      height: 40,
      backgroundColor: '#FFF',
      borderColor: '#599D95',
      alignSelf: 'center',
      width: 275,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      borderWidth: 2
    },
    textButton:{
      color: 'white'
    },
    buttonText:{
      fontSize: 16,
      color: 'grey',
      alignSelf: 'center',
      fontWeight: '100'
    },
    input:{
      height: 40,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48bbec',
      borderRadius: 0,
      color: '#48BBEC',
  },
    inputs: {
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    inputContainer: {
        alignItems: 'stretch',
    },
    input: {
        position: 'absolute',
        left: 61,
        height: 20,
        fontSize: 16,
        paddingLeft: 10
    },
    registerForgotContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
    },
    whiteFont: {
      color: '#FFF'
    }
})

export default Register;
