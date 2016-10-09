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
      id: 'AddNewClass'
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
        <Text style = {styles.smallText}>
        Welcome to your Dashboard!
        </Text>
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
      padding: 25,
      flex: 1,
  },
  smallText:{
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 20
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonText:{
    fontSize:22,
    color: '#FFF',
    alignSelf: 'center'
  }
});

module.exports = StudentDashboardView;
