'use strict'

import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableHighlight, AsyncStorage } from 'react-native';

var authService = require('../utilities/AuthService');


class StudentDashboardView extends Component{
  constructor(props){
    super(props);
  }

  onClassesPressed(){
    this.props.navigator.push({
      id: 'ClassList'
    });
    console.log('Classes button pressed!')
  }
  onAssignmentsPressed(){
    this.props.navigator.push({
      id: 'AssignmentsDash'
    });
  }
  onAccountPressed(){
    console.log('Account button pressed')
  }
  onLogoutPressed(){
    authService.logout(err => console.log(err));
    this.props.navigator.pop();
    console.log('Logout button pressed');
  }

  render(){
    return(
      <View style={styles.container}>

        <TouchableHighlight style = {styles.button} onPress={(this.onClassesPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            My Classes
          </Text>
        </TouchableHighlight>

        <TouchableHighlight style = {styles.button} onPress={(this.onAssignmentsPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            My Assignments
          </Text>
        </TouchableHighlight>

        <TouchableHighlight style = {styles.button} onPress={(this.onAccountPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            My Account
          </Text>
        </TouchableHighlight>
        <TouchableHighlight style = {styles.button} onPress={() => this.onLogoutPressed()} >
          <Text style = {styles.buttonText}>
            Logout
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

module.exports = StudentDashboardView;
