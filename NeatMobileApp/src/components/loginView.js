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
var t = require('tcomb-form-native');
var Form = t.form.Form;

var LoginForm = t.struct({
  username: t.String,
  password: t.String,
  rememberMe: t.Boolean
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

class loginView extends Component{
  constructor(){
    super();

    this.state = {
      value: {
      },
      email: "",
      password: "",
      errors: [],
      showProgress: false,
    }
  }

  onLoginPressed(){
    this.setState({showProgess: true});
    var value = this.refs.form.getValue();
    console.log('username and password: ', this.state.value.username, this.state.value.password);

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
          console.log('you have logged in');
          this.setState({value: null})
        }
    });
  }

  onRegisterPressed(){
    this.props.navigator.push({
      id: 'Register'
    });
    console.log('you have push the register button');
  }

  render(){

    return(
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo}/>
        <Text style={styles.heading}>
          NEAT
        </Text>
        <View style={styles.inputs, styles.inputContainer}>
          <Form
            ref="form"
            type={LoginForm}
            options={options}
            value={this.state.value}
            onChange={(value) => this.setState({value})}
          />
        </View>

        {/* <View style={styles.inputs}>
          <View style={styles.inputContainer}>
              <Image style={styles.inputIcon} source={require('image!ic_perm_identity')}/>
              <TextInput
                  style={[styles.input, styles.greyFont]}
                  placeholder='Username'
                  onChangeText={(text)=> this.setState({username: text})}
              />
          </View>
          <View style={styles.inputContainer}>
              <Image style={styles.inputIcon} source={require('image!ic_lock_outline')}/>
              <TextInput
                  password={true}
                  style={[styles.input, styles.greyFont]}
                  placeholder='Password'
                  onChangeText={(text)=> this.setState({password: text})}
              />
          </View> */}

          <View style={styles.registerForgotContainer}>
              <View style={styles.registerContainer}>
                  <Text style={styles.greyFont} onPress={(this.onRegisterPressed.bind(this))}>
                    Register
                  </Text>
              </View>
              <View style={styles.forgotContainer}>
                  <Text style={styles.greyFont} >Forgot?</Text>
              </View>
          </View>
        <TouchableHighlight style = {styles.button} onPress={this.onLoginPressed.bind(this)} >
          <Text style = {styles.buttonText}>
            Sign In
          </Text>
        </TouchableHighlight>
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
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
})
module.exports = loginView;
