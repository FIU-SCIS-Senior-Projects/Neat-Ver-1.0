/*import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Progress from 'react-native-progress';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
});

class AssignmentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0.20,
      indeterminate: false,
    };
  }



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Progress Example</Text>
        <Progress.Bar
          style={styles.progress}
          progress={this.state.progress}
          indeterminate={this.state.indeterminate}
          animated= {false}
        />
        <View style={styles.circles}>
          <Progress.Circle
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
          />
          <Progress.Pie
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
          />
          <Progress.Circle
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
            direction="counter-clockwise"
          />
        </View>

      </View>
    );
  }
}

*/
import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
  TextInput
} from 'react-native';

class AssignmentForm extends Component{

    render(){
        return(
        <View style={{ marginTop: 65 }}>
            <TextInput
                    onChangeText={(text)=> this.setState({text})}
                    style={styles.input}
                    placeholder="Subject"></TextInput>
            <TextInput
                    onChangeText={(text)=> this.setState({text})}
                    style={styles.input}
                    placeholder="Assignment"></TextInput>

            <TouchableHighlight
                //onPress={this.onDonePressed.bind(this)}
                style={styles.button}>
                    <Text style={{ color: '#ffffff' }}>
                        Done
                    </Text>
            </TouchableHighlight>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
            height: 50,
            padding: 4,
            fontSize: 18,
            borderWidth: 1,
            borderColor: '#48bbec',
            borderRadius: 0,
            color: '#48BBEC',

        },
        button: {
                  height: 50,
                  backgroundColor: '#48BBEC',
                  borderColor: '#48BBEC',
                  alignSelf: 'stretch',
                  marginTop: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
        },
});


module.exports = AssignmentForm;

