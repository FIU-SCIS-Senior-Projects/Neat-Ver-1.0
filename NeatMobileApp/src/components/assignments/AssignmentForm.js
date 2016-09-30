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

import styles from './styles';

class AssignmentForm extends Component{

    render(){
        return(
        <View style={{ marginTop: 65 }}>
            <TextInput
                    onChangeText={(text)=> this.setState({text})}
                    style={styles.input}
                    placeholder="Subject">
            </TextInput>
            <TextInput
                    onChangeText={(text)=> this.setState({text})}
                    style={styles.input}
                    placeholder="Assignment">
            </TextInput>


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

module.exports = AssignmentForm;

