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
  Switch,
} from 'react-native';

import styles from './styles';

var Assignments = require('./Assignments');

class AssignmentView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            dataSource: ds,
            assignmentUrl: props.assignmentUrl,
            toggleState: false,
        };
    }

    componentDidMount(){
            this.fetchTasks();
          }

    fetchTasks(){

        return fetch('http://127.0.0.1:8000/api/task/')
              .then((response) => response.json())
              .then((responseJson) => {
                var taskList = responseJson;
                var display = [];
                var j = 0
                for(var i = 0; i < taskList.length; i++){
                    if(taskList[i].user ===  'http://127.0.0.1:8000/api/user/1/' && taskList[i].assignment === this.state.assignmentUrl){
                        display[j] = taskList[i];
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

    onAddTask(){
        this.props.navigator.push({
            id: 'TaskForm',
            passProps:{
                assignmentUrl: this.state.assignmentUrl
            }
        });
    }
    pressDashboard(){
         this.props.navigator.push({
            id: 'AssignmentsDash'
        });
    }

    renderRow(rowData){
        return(
            <View style={styles.List}>
                <Switch
                    onValueChange={(value) => this.setState({toggleState: value})}
                    style={{marginBottom: 10}}
                    value={rowData.isDone} />
                <Text>{rowData.taskName}</Text>
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
            </ScrollView>

        );
    }
}

module.exports = AssignmentView;
