'use strict'

import React, { Component } from 'react';
import { View ,Text ,TextInput, TouchableHighlight ,Alert ,StyleSheet } from 'react-native';
import api from './../utilities/api';


class NewClass extends Component{

  constructor(props){
    super(props);
    this.state={
      users:[],
      username: ''
    }
  }

  componentWillMount(){
    api.getUsers().then((res)=>{
      this.setState({
        users: res.users,
        username: res.user[0].username
      })
    });
  }

  onAddNewClassPressed(){
    this.props.navigator.push({
      id: ' '
    });
    console.log('you have pushe the Add new class button')
  }

  render(){
    console.log("Users:",this.state.users);
    return(
      <View>
        <Text style = {styles.smallText}>
          username:{this.state.username}
        </Text>
        <TouchableHighlight style = {styles.button} onPress={(this.onAddNewClassPressed.bind(this))} >
          <Text style = {styles.buttonText}>
            Add New Class
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  smallText:{
    fontSize: 22,
    alignSelf: 'center',
    marginTop: 10
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 20,
    justifyContent: 'center'
  },
  buttonText:{
    fontSize:22,
    color: '#FFF',
    alignSelf: 'center'
  },
  input:{
    height: 50,
    marginTop: 20,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  }
})

module.exports = NewClass;
