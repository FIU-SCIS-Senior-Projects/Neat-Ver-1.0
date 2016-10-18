import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
  ListView,
  ScrollView,
} from 'react-native';

import styles from './styles';

var Classes = require('./Classes');

class ClassView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            dataSource: ds,
            classUrl: props.classUrl
        };
    }

    //TODO Fix repeated code here as this can be loaded from previous prop
    componentDidMount(){
            this.fetchAssignments();
          }

    fetchAssignments(){

        return fetch('http://52.87.176.128/api/assignments/')
              .then((response) => response.json())
              .then((responseJson) => {
                var assignmentList = responseJson;
                var display = [];
                var j = 0
                for(var i = 0; i < assignmentList.length; i++){
                    if(assignmentList[i].classFK ===  this.state.classUrl){
                        display[j] = assignmentList[i];
                        j++;
                    }
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(display)
                })
              })
              .catch((error) => {
                console.error(error);
              });
    }

    onAddAssignment(){
        this.props.navigator.push({
            id: 'AssignmentForm',
            passProps:{
                classUrl: this.state.classUrl
            }
        });
    }
    pressDashboard(){
         this.props.navigator.push({
            id: 'ClassDash'
        });
    }

    renderRow(rowData){
        return(
            <View style={styles.List}>
                <Text>{rowData.assignmentName}</Text>
            </View>
        );
    }

    render(){
        return(

            <ScrollView>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />

            <TouchableHighlight style={styles.button}
                onPress={this.onAddAssignment.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Add Assignment
                </Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
                onPress={this.pressDashboard.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Class Dashboard
                </Text>
            </TouchableHighlight>
            </ScrollView>

        );
    }
}

module.exports = ClassView;
