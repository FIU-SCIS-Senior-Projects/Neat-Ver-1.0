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


class loginView extends Component{
  constructor(){
    super();

    this.state = {
      email: "",
      password: "",
      errors: [],
    }
  }

  onLoginPressed(){
    this.props.navigator.push({
      id: 'StudentDashboard'
    });
    console.log('you have push the login button')
  }

  onRegisterPressed(){
    this.props.navigator.push({
      id: 'Register'
    });
    console.log('you have push the register button')
  }

  render(){

    return(
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo}/>
        <Text style={styles.heading}>
          NEAT
        </Text>

        {/* <TextInput
          onChangeText={(val) => this.setState({email: val})}
          style={styles.input}
          placeholder="Email"
        />
        <TextInput
          onChangeText={(val) => this.setState({password: val})}
          style={styles.input} placeholder="Password"
          secureTextEntry={true}
        /> */}
        <View style={styles.inputs}>
          <View style={styles.inputContainer}>
              <Image style={styles.inputUsername} source={require('image!ic_perm_identity')}/>
              <TextInput
                  style={[styles.input, styles.greyFont]}
                  placeholder="Username"
                  value={this.state.username}
              />
          </View>
          <View style={styles.inputContainer}>
              <Image style={styles.inputPassword} source={require('image!ic_lock_outline')}/>
              <TextInput
                  password={true}
                  style={[styles.input, styles.greyFont]}
                  placeholder="Pasword"
                  value={this.state.password}
              />
          </View>

          <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  marginBottom: 20
              }}>
              <View style={styles.registerContainer}>
                  <Text style={styles.greyFont}>Register</Text>
              </View>
              <View style={styles.forgotContainer}>
                  <Text style={styles.greyFont}>Forgot?</Text>
              </View>
          </View>
        </View>
        <TouchableHighlight style = {styles.button} onPress={(this.onLoginPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            Sign In
          </Text>
        </TouchableHighlight>

        {/* <TouchableHighlight style = {styles.button} onPress={(this.onRegisterPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            register
          </Text>
        </TouchableHighlight> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#FFF',
      padding: 20,
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 150,
      height: 150,
    },
    heading: {
      fontSize: 60,
      fontWeight: '300'
    },
    button: {
      height: 50,
      backgroundColor: '#FFF',
      borderColor: '#599D95',
      alignSelf: 'stretch',
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      borderWidth: 3
    },
    textButton:{
      color: 'white'
    },
    buttonText:{
      fontSize: 18,
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
        // marginTop: 10,
        // marginBottom: 10,
        // flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21
    },
    inputUsername: {
      marginLeft: 15,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        // borderWidth: 1,
        // borderBottomColor: '#CCC',
        // borderColor: 'transparent'
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 14
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
