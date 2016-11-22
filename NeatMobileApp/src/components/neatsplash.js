'use strict'

import React, { Component } from 'react';
import { View ,Text ,TextInput, TouchableHighlight ,Alert ,StyleSheet,Image } from 'react-native';

import Logo from './../assets/img/Logo_Neat.png';
/*
  Create a splash creen for our application
*/
class neatsplash extends Component{
  constructor(props){
    super(props);
    this.state = {
      done: false
    }
  }

  /*sets the timeout for 1 second*/
  timer(){
    setTimeout(()=>{
      this.setState({
        done: true
      });
    }, 3000)
  }
  /*The application finished loadding*/
  componentDidMount(){
    this.timer();
  }

  render(){
    return(
      this.state.done ?
      /*If done, show all nested*/
      ({...this.props.children})
      :
      /*Display the splash screen*/
      (<View style = {[styles.container, this.props.backgroundColor]}>
          <Image source ={Logo}/>
          <Text style={styles.heading}>NEAT</Text>
      </View>)
    );
  }
}


const styles = StyleSheet.create({
    container:{
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5fcff'
    },
    heading: {
      fontSize: 60,
      fontWeight: '300',
      margin: 10,
      marginBottom: 20
    },
  });

  export default neatsplash
