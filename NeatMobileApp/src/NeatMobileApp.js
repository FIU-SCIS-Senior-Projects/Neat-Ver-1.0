import React, { Component } from 'react';
import { AppRegistry, Text, StyleSheet, View,Image, Navigator, ActivityIndicator, TouchableHighlight} from 'react-native';

const Login = require('./components/loginView');

//Classes
const ClassList = require('./components/classes/Classes');
const ClassForm = require('./components/classes/ClassForm');
const ClassView = require('./components/classes/ClassView');

//Assignment
const AssignmentsDash = require('./components/assignments/UserAssignment');
const AssignmentForm = require('./components/assignments/AssignmentForm');
const AssignmentView = require('./components/assignments/AssignmentView');
const TaskForm = require('./components/assignments/TaskForm');

import Register from './components/registration/register';
import ResetPassword from './components/credentials/reset';
import UpdatePassword from './components/credentials/updatePassword';
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
    this.setState({isLoggedIn: true});
  }

  configureScene(route, routeStack){
    if(route.type === 'Pop') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight
  }
  render() {
    if(this.state.isLoggedIn) {
      return (
        <Splash duration={3000} backgroundColor={styles.splashContainer}>
          <View style ={styles.container}>

            <Navigator
              configureScene={ this.configureScene }
              initialRoute = {{
                id: 'AssignmentsDash',
                title: 'Dashboard',
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
        <Splash duration={500} backgroundColor={styles.splashContainer}>
          <View style ={styles.container}>

            <Navigator
              configureScene={this.configureScene}
              initialRoute = {{id: 'Login'}}
              renderScene = {this.navigatorRenderScene}
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
        return(<Register navigator = {navigator} title = 'Register' />)
      case 'ResetPassword':
        return(<ResetPassword navigator = {navigator} title = 'ResetPassword'/>)
      case 'UpdatePassword':
        return(<UpdatePassword navigator = {navigator} title = 'UpdatePassword'/>)
      case 'AssignmentsDash':
        return(<AssignmentsDash navigator = {navigator} {...route.passProps} title = 'AssignmentsDash'/>)
      case 'AssignmentForm':
        return(<AssignmentForm navigator = {navigator} {...route.passProps} title = 'AssignmentForm'/>)
      case 'AssignmentView':
          return(< AssignmentView navigator = {navigator}  {...route.passProps} title = 'AssignmentView'/>)
      case 'ClassList':
        return(<ClassList navigator = {navigator} {...route.passProps} title = 'ClassList'/>)
      case 'ClassForm':
        return(<ClassForm navigator = {navigator} title = 'ClassForm'/>)
      case 'ClassView':
          return(< ClassView navigator = {navigator}  {...route.passProps} title = 'ClassView'/>)
      case 'TaskForm':
          return(<TaskForm navigator = {navigator} {...route.passProps} title = 'TaskForm'/>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    // marginTop: 10
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
