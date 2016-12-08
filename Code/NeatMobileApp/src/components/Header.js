'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';

import Logo from './../assets/img/Logo_Neat.png';

class Header extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <View>
        <Image source={Logo} style={styles.logo}/>
        <Text style={styles.heading}>
          NEAT
        </Text>
        {/* <ActivityIndicator
          animating={this.props.showProgress}
          size="large"
          style={styles.loader} /> */}
          {this.props.showProgress
           ? <ActivityIndicator animating size='large' />
           : null
          }
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
})

module.exports = Header;
