'use strict'

import React, { Component } from 'react';
import { View ,Text ,TextInput, TouchableHighlight ,Alert ,StyleSheet,ListView } from 'react-native';
import api from './../../utilities/api';
import _ from 'lodash';
import * as Progress from 'react-native-progress';

/*
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
var authService = require('../../utilities/AuthService');
var Header = require('./../Header');
*/

const userClasses =[
    {
    className: "Calculus I",
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



const progress =[
  {
   "name":"nelson",
   "perc":0.9
  },
  {
    "name":"sailen",
    "perc":0.8
  },
  {
   "name":"Nilda",
   "perc":0.65
  },
  {
    "name":"Carlos",
    "perc":0.5
  },
  {
   "name":"John",
   "perc":0.5
  },
  {
    "name":"Ruben",
    "perc":0.4
  }
]
class ClassRank extends Component{

  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 != r2})

    this.state={
      progress: 0.58,
      indeterminate: false,
      classesDatasource: ds.cloneWithRows(progress)
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
  onAddNewClassPressed(){

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
            dataSource = {this.state.classesDatasource}
            renderRow = {(classes) => {return this._renderClassRow(classes)}}
        />


        <TouchableHighlight style = {styles.button} onPress={(this.onAddNewClassPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            +
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  _renderClassRow(classes){
      return(
          <View style={styles.container}>
            <Text style = {styles.classname}>
                {classes.name + " " + (classes.perc * 100) + "%"}
            </Text>
            <Progress.Bar progress={classes.perc}
                          width={200}
                          height={10}
                          color ={'#599D95'}/>
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

    export default ClassRank;
