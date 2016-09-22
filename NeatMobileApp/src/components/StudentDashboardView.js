'use strict'

import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';


class StudentDashboardView extends Component{

  onClassesPressed(){
    this.props.navigator.push({
      id: 'AddNewClass'
    });
    console.log('Classes button pressed!')
  }
  onAssignmentsPressed(){
    console.log('Assignments button pressed!')
  }
  onAccountPressed(){
    console.log('Account button pressed')
  }

  render(){
    return(
      <View>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  smallText:{
    fontSize: 10,
    alignSelf: 'center',
    marginTop: 20
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText:{
    fontSize:22,
    color: '#FFF',
    alignSelf: 'center'
  }
});

module.exports = StudentDashboardView;
