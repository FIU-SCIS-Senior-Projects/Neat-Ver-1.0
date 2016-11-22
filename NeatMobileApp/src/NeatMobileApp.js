import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TabBarIOS,
} from 'react-native';

import ChatRoom from './components/ChatRoom';
import Icon from 'react-native-vector-icons/Ionicons';
import Register from './components/registration/register';
import ResetPassword from './components/credentials/reset';
import UpdatePassword from './components/credentials/updatePassword';
import Splash from './components/neatsplash';

import AuthService from './utilities/AuthService';

import Login from './components/Login';

// Classes
import ClassList from './components/classes/Classes';
import ClassForm from './components/classes/ClassForm';
import ClassView from './components/classes/ClassView';

// Assignment
import Dashboard from './components/Dashboard';
import AssignmentForm from './components/assignments/AssignmentForm';
import AssignmentView from './components/assignments/AssignmentView';
import TaskForm from './components/assignments/TaskForm';

class NeatMobileApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      selectedTab: 'Assignments',
    };
  }
  componentDidMount() {
    AuthService.getLoginToken()
    .then((authInfo) => {
      this.setState({
        isLoggedIn: authInfo.token != null,
      });
    });
  }

  onLogin() {
    this.setState({ isLoggedIn: true });
  }

  configureScene(route) {
    if (route.type === 'Pop') {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    return Navigator.SceneConfigs.PushFromRight;
  }
  navigatorRenderScene(route, navigator) {
    // _navigator = navigator;
    switch (route.id) {
      case 'Login':
        return (<Login navigator={navigator} title="Login" />);
      case 'Register':
        return (<Register navigator={navigator} title="Register" />);
      case 'ResetPassword':
        return (<ResetPassword navigator={navigator} title="ResetPassword" />);
      case 'UpdatePassword':
        return (<UpdatePassword navigator={navigator} title="UpdatePassword" />);
      case 'Dashboard':
        return (<Dashboard navigator={navigator} {...route.passProps} title="Dashboard" />);
      case 'AssignmentForm':
        return (<AssignmentForm navigator={navigator} {...route.passProps} title="AssignmentForm" />);
      case 'AssignmentView':
        return (<AssignmentView navigator={navigator} {...route.passProps} title="AssignmentView" />);
      case 'ClassList':
        return (<ClassList navigator={navigator} {...route.passProps} title="ClassList" />);
      case 'ClassForm':
        return (<ClassForm navigator={navigator} title="ClassForm" />);
      case 'ClassView':
        return (<ClassView navigator={navigator} {...route.passProps} title="ClassView" />);
      case 'TaskForm':
        return (<TaskForm navigator={navigator} {...route.passProps} title="TaskForm" />);
      case 'ChatRoom':
        return (<ChatRoom navigator={navigator} {...route.passProps} title="ChatRoom" />);
    }
  }
  render() {
    if (this.state.isLoggedIn) {
      return (
        <Splash duration={3000} backgroundColor={styles.splashContainer}>
          <TabBarIOS
            tintColor="black"
          // barTintColor='#3abeff'
          >
            <Icon.TabBarItemIOS
              title="Assignments"
              iconName="ios-paper-outline"
              selectedIconName="ios-paper"
              selected={this.state.selectedTab === 'Assignments'}
              onPress={() => this.setState({ selectedTab: 'Assignments' })}
            >
              <Navigator
                configureScene={this.configureScene}
                initialRoute={{
                  id: 'Dashboard',
                  title: 'Dashboard',
                }}
                renderScene={this.navigatorRenderScene}
                onLogin={() => this.onLogin}
              />
            </Icon.TabBarItemIOS>
            <Icon.TabBarItemIOS
              title="Classes"
              iconName="ios-school-outline"
              selectedIconName="ios-school"
              selected={this.state.selectedTab === 'Classes'}
              onPress={() => this.setState({ selectedTab: 'Classes' })}
            >
              <Navigator
                configureScene={this.configureScene}
                initialRoute={{
                  id: 'ClassList',
                  title: 'Classes',
                }}
                renderScene={
                this.navigatorRenderScene
              }
                onLogin={() => this.onLogin}
              />
            </Icon.TabBarItemIOS>
            <Icon.TabBarItemIOS
              title="Chatroom"
              iconName="ios-chatbubbles-outline"
              selectedIconName="ios-chatbubbles"
              selected={this.state.selectedTab === 'ChatRoom'}
              onPress={() => this.setState({ selectedTab: 'ChatRoom' })}
            >
              <Navigator
                configureScene={this.configureScene}
                initialRoute={{
                  id: 'ChatRoom',
                  title: 'ChatRoom',
                }}
                renderScene={this.navigatorRenderScene}
                onLogin={() => this.onLogin}
              />
            </Icon.TabBarItemIOS>
          </TabBarIOS>
        </Splash>
      );
    }
    return (
      <Splash duration={500} backgroundColor={styles.splashContainer}>
        <View style={styles.container}>

          <Navigator
            configureScene={this.configureScene}
            initialRoute={{ id: 'Login' }}
            renderScene={this.navigatorRenderScene}
          />
        </View>
      </Splash>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
  splashContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default NeatMobileApp;
