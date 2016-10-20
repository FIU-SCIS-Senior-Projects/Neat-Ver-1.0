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

var Assignments = require('./UserAssignment');

    CONFIG = require('../../config.js');


class AssignmentView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            dataSource: ds,
            assignmentUrl: props.assignmentUrl,
            toggleState: true,
            trueSwitchIsOn: true,
        };
    }

    componentDidMount(){
        this.fetchTasks();

    }
    componentWillReceiveProps(){
        this.fetchTasks();
    }
    fetchTasks(){

        return fetch(CONFIG.server.host + 'api/task/')
              .then((response) => response.json())
              .then((responseJson) => {
                var taskList = responseJson;

                var display = [];
                var j = 0

                for(var i = 0; i < taskList.length; i++){
                    if(taskList[i].user ===  CONFIG.server.host + 'api/user/1/' && taskList[i].assignment === this.state.assignmentUrl){
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
        let route = this.props.navigator.getCurrentRoutes().find((route) => route.id === 'AssignmentsDash');
        this.props.navigator.popToRoute(route);
    }

    async putToogleData(rowData){
    }


    renderRow(rowData){
        return(
            <View style={styles.List}>
                <Switch
                    onValueChange={() => {rowData.isDone = !rowData.isDone; console.log(rowData.taskName + ' task complete : ' + rowData.isDone)}}
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
              enableEmptySections= {true}
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
