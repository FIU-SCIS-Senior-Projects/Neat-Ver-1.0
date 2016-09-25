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

