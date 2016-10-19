'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableHighlight,
    Alert,
    StyleSheet,
    Image,
} from 'react-native';

import Logo from './../assets/img/Logo_Neat.png';
var authService = require('../utilities/AuthService');
var LoginForm = require('./LoginForm');
var Header = require('./Header');

class loginView extends Component{
  constructor(props){
    super(props);

    this.state = {
      value: {
      },
      email: "",
      password: "",
      errors: [],
      showProgress: false,
      success: false,
    }
  }

  onLoginPressed(){
    this.setState({showProgress: true});

    authService.login({
        username: this.state.value.username,
        password: this.state.value.password
    }, (results)=> {
        this.setState(Object.assign({
            showProgress: false
        }, results));
        if(results.success){
          this.props.navigator.push({
            id: 'StudentDashboard'
          });
          this.setState({
            value : {},
            success: false,
            badCredentials: false,
            unknownError: false
          })
        }
        else {
          console.log('error during login: ', results.status);
        }
    });
  }

  onRegisterPressed(){
    this.props.navigator.push({
      id: 'Register'
    });
    console.log('you have push the register button');
  }

  onForgotPressed(){
    this.props.navigator.push({
      id: 'ResetPassword'
    });
    console.log('Reset password requested');
  }

  render(){
    var errorCtrl = <View />;
    console.log('state info: ', this.state.success, this.state.badCredentials, this.state.unknownError, this.state.value);

    if(!this.state.success && this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
        That username and password combination did not work
      </Text>
    }

    if(!this.state.success && this.state.unknownError) {
      errorCtrl = <Text style={styles.error}>
        We experienced an unexpected issue
      </Text>
    }
    return(
      <View style={styles.container}>
        <Header
          showProgress={this.state.showProgress}
        />
        <View style={styles.inputs, styles.inputContainer}>
          <LoginForm
            value={this.state.value}
            onChange={(value) => this.setState({value})}
            />
        </View>
        <View style={styles.registerForgotContainer}>
          <View style={styles.registerContainer}>
            <Text
              style={styles.greyFont}
              onPress={(this.onRegisterPressed.bind(this))}>
              Register
            </Text>
          </View>
          <View style={styles.forgotContainer}>
              <Text style={styles.greyFont} onPress={(this.onForgotPressed.bind(this))}
              >Forgot?</Text>
          </View>
        </View>
        <TouchableHighlight
          style = {styles.button}
          onPress={this.onLoginPressed.bind(this)} >
          <Text style = {styles.buttonText}>
            Sign In
          </Text>
        </TouchableHighlight>
        {errorCtrl}
      </View>
    )
  }
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
      height: 50,
      backgroundColor: '#FFF',
      borderColor: '#599D95',
      alignSelf: 'center',
      width: 275,
      marginTop: 10,
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
      height: 50,
      marginTop: 20,
      padding: 4,
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
    inputIcon: {
        marginLeft: 15,
        width: 21,
        height: 21
    },
    inputContainer: {
        padding: 10,
        alignItems: 'stretch',
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
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
    registerContainer: {
      alignItems: 'flex-start',
      padding: 15,
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      // color: '#D8D8D8'
      color: '#000'
    },
    whiteFont: {
      color: '#FFF'
    },
    error: {
      alignSelf: 'center',
      color: 'red',
      paddingTop: 10
    }
})
module.exports = loginView;
