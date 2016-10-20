import React, { Component } from 'react';
import { AppRegistry, Text, StyleSheet, View,Image, Navigator, ActivityIndicator,} from 'react-native';

const Login = require('./components/loginView');
const StudentDashboard = require('./components/StudentDashboardView');
const ClassList = require('./components/classList/ClassList');
const ClassDash = require('./components/classes/Classes');
const ClassForm = require('./components/classes/ClassForm');
const ClassView = require('./components/classes/ClassView');
const AssignmentsDash = require('./components/assignments/Assignments');
const AssignmentForm = require('./components/assignments/AssignmentForm');
const AssignmentView = require('./components/assignments/AssignmentView');
const TaskForm = require('./components/assignments/TaskForm');

import Register from './components/registration/register';
import ResetPassword from './components/credentials/reset';
import UpdatePassword from './components/credentials/updatePassword';
import Splash from './components/neatsplash';

import ClassRank from './components/classRanking/ClassRank';
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
        <Splash duration={500} backgroundColor={styles.splashContainer}>
          <View style ={styles.container}>

            <Navigator
              initialRoute = {{
                id: 'Login'//'Login'
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
        return(<Register navigator = {navigator} title = 'Register' />)
      case 'ResetPassword':
        return(<ResetPassword navigator = {navigator} title = 'ResetPassword'/>)
      case 'UpdatePassword':
        return(<UpdatePassword navigator = {navigator} title = 'UpdatePassword'/>)
      case 'StudentDashboard':
        return(<StudentDashboard navigator = {navigator} title = 'StudentDashboard' />)
      case 'ClassList':
        return(<ClassList navigator = {navigator} title = 'ClassList'/>)
      case 'AssignmentsDash':
        return(<AssignmentsDash navigator = {navigator} title = 'AssignmentsDash'/>)
      case 'AssignmentForm':
        return(<AssignmentForm navigator = {navigator} title = 'AssignmentForm'/>)
<<<<<<< HEAD
        case 'ClassRank':
          return(<ClassRank navigator = {navigator} title = 'ClassRank'/>)
=======
      case 'ClassRank':
          return(<ClassRank navigator = {navigator} title = 'ClassRank'/>)
      case 'AssignmentView':
          return(< AssignmentView navigator = {navigator}  {...route.passProps} title = 'AssignmentView'/>)
      case 'ClassDash':
        return(<ClassDash navigator = {navigator} title = 'ClassDash'/>)
      case 'ClassForm':
        return(<ClassForm navigator = {navigator} title = 'ClassForm'/>)
      case 'ClassView':
          return(< ClassView navigator = {navigator}  {...route.passProps} title = 'ClassView'/>)
      case 'TaskForm':
          return(<TaskForm navigator = {navigator} {...route.passProps} title = 'TaskForm'/>)
>>>>>>> dev
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
