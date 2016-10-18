'use strict'

import React, { Component } from 'react';
import { View ,Text ,TextInput, TouchableHighlight ,Alert ,StyleSheet,ListView } from 'react-native';
import api from './../../utilities/api';
import _ from 'lodash';

/*
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
var authService = require('../../utilities/AuthService');
var Header = require('./../Header');
*/

const classAssignments =[
    {  className: "Calculus I",
     assignments: [
         "homework I",
         "class project I"]
     },
    {  className: "Physics 2",
     assignments: [
         "homework 3",
         "class project 4"]
     },
    {  className: "Programming III",
     assignments: [
         "homework 2",
         "project I"]
     },
]


class AssignmentsList extends Component{

  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 != r2})

    this.state={
      assignmentsDatasource: ds.cloneWithRows(classAssignments)
      //users:[],
      //username: ''
    }
  }
/*
  componentWillMount(){
    api.getUsers().then((res)=>{
      this.setState({
        users: res.users,
        username: res.user[0].username
      })
    });
  }
*/
  onAddNewAssignment(){

    this.props.navigator.push({
      id: ' '
    });
    console.log('you have pushe the Add new class button')
  }

  render(){
    return(
      <View style={styles.container}>
        <ListView
            style = {{marginTop: 100}}
            dataSource = {this.state.assignmentsDatasource}
            renderRow = {(assignments) => {return this._renderClassRow(assignments)}}
        />


        <TouchableHighlight style = {styles.button} onPress={(this.onAddNewAssignment.bind(this))} >
          <Text style = {styles.buttonText}>
            +
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  _renderClassRow(classes){
      return(
          <View style={styles.classRow}>
            <Text style = {styles.classname}>
                {classes.className}
            </Text>
          </View>
      )
  }
}

const styles = StyleSheet.create({
    classRow:{
        flexDirection: 'row',
        justifyContent: 'center',
    },
    classname:{
        borderColor: '#599D95',
        //borderWidth: 1,
        //width: 175,
        //height: 40,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        //padding: 35,
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
        height: 80,
        width:80,
        backgroundColor: '#FFF',
        borderColor: '#599D95',
        alignSelf: 'center',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        borderWidth: 4
      },
      textButton:{
        color: 'white',
      },
      buttonText:{
        fontSize: 50,
        color: '#599D95',
        alignSelf: 'center',
        fontWeight: '200',
        paddingBottom: 5
      },
      input:{
        height: 40,
        fontSize: 18,
        borderWidth: 2,
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
      whiteFont: {
        color: '#FFF'
      }
  })
module.exports = ClassList;
