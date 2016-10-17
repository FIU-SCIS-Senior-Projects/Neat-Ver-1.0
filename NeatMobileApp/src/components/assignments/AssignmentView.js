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
  ListView
} from 'react-native';

import styles from './styles';

var Assignments = require('./Assignments');

class AssignmentView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        var taskList = props.assignment.tasks;
        var displayTask = [];
        var j =0

        for(var i = 0; i < taskList.length;i++){
            if(taskList[i].user === 'http://127.0.0.1:8000/api/user/1/?format=json'){
                displayTask[j] = taskList[i];
                j++;
            }
        }

        this.state={
            dataSource: ds.cloneWithRows(displayTask),
            assignmentUrl: props.assignment.url

        };
    }

    onAddTask(){
        this.props.navigator.push({
            id: 'TaskForm',
            passProps:{
                assignmentUrl: this.state.assignmentUrl
            }
        });
    }
    pressDashboard(){
         this.props.navigator.pop({
            id: 'Assignments'

        });
    }


    renderRow(rowData){

        return(
            <View style={styles.List}>
                <Text>{rowData.taskName}</Text>
            </View>
        );

    }

    render(){
        return(
        <View >

            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />

            <TouchableHighlight style={styles.button}
                onPress={this.onAddTask.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Add Task
                </Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
                onPress={this.pressDashboard.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Assignment Dashboard
                </Text>
            </TouchableHighlight>
        </View>
        );
    }
}

module.exports = AssignmentView;
