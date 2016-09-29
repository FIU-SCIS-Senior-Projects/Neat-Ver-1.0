import React, { Component } from 'react';
import { AppRegistry, Text, StyleSheet, View,Image, Navigator, ActivityIndicator,} from 'react-native';

const Login = require('./components/loginView')
const StudentDashboard = require('./components/StudentDashboardView')
const AddNewClass = require('./components/newClassView')

import Register from './components/registration/register';
import Splash from './components/neatsplash';

var AuthService = require('./utilities/AuthService');
import { AsyncStorage } from 'react-native';


class NeatMobileApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false
    }
  }
  componentDidMount(){
    AuthService.getLoginToken((err, authInfo)=> {
      this.setState({
        isLoggedIn: authInfo != null
      })
    });
  }

  onLogin(){
    console.log('onLogin was called from index');
    this.setState({isLoggedIn: true});
  }
  render() {
    if(this.state.isLoggedIn) {
      return (
        <Splash duration={3000} backgroundColor={styles.splashContainer}>
          <View style ={styles.container}>

            <Navigator
              initialRoute = {{
                id: 'StudentDashboard'
              }}
              renderScene = {
                this.navigatorRenderScene
              }
              onLogin={() => this.onLogin}
            />
          </View>
        </Splash>
      );
    }
    else {
      return (
        <Splash duration={3000} backgroundColor={styles.splashContainer}>
          <View style ={styles.container}>

            <Navigator
              initialRoute = {{
                id: 'Login'
              }}
              renderScene = {
                this.navigatorRenderScene
              }
            />
          </View>
        </Splash>
      );
    }
  }

  navigatorRenderScene(route,navigator){
    _navigator = navigator;
    switch(route.id){
      case 'Login':
        return(<Login navigator = {navigator} title = 'Login'/>)
      case 'Register':
        return(<Register navigator = {navigator} title = 'Register'/>)
      case 'StudentDashboard':
        return(<StudentDashboard navigator = {navigator} title = 'StudentDashboard'/>)
      case 'AddNewClass':
        return(<AddNewClass navigator = {navigator} title = 'AddNewClass'/>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  splashContainer:{
    backgroundColor: 'white'
  }
});

export default NeatMobileApp;