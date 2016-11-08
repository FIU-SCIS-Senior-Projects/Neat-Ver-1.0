import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  ListView,
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

var AssignmentForm = require('./AssignmentForm');
var AssignmentView = require('./AssignmentView');
var moment = require('moment'),
    CONFIG = require('../../config.js');

class Assignments extends Component{
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
          dataSource: ds,
          //progress: 0.58,
          indeterminate: false,
        };
      }

      componentDidMount(){
        this.fetchAssignments();
      }
      componentWillReceiveProps(){
       this.fetchAssignments();
      }

      fetchAssignments(){
        return fetch(CONFIG.server.host + '/assignment/', {
            method  : 'GET',
            headers : { 'Content-Type' : 'application/json' }
            })
              .then((response) => response.json())
              .then((responseJson) => {

                var assignmentList = responseJson;
                console.log('my print state: ' + responseJson.assignmentName)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(assignmentList)
                })
              })
              .catch((error) => {
                console.error(error);
              });
      }

      onAddPressed(){
        this.props.navigator.push({
            id: 'ClassList'
        });
      }

      onChatRoomPressed(){
        this.props.navigator.push({
            id: 'ChatRoom'
        });
      }

      onPressRow(rowData){

        this.props.navigator.push({
            id: 'AssignmentView',
            passProps: {
                assignmentUrl: rowData.url
            }
        });
      }

      changeColor(progress){
      var color = ''
        if(progress < 0.33){
           color='#F44336'
        }
        else if(progress >= 0.33 && progress < 0.66){
            color='#ffcc00'
        }
        else{
            color='#009688'
        }
        return color;
      }

      displayDueDate(start, due){
        var str = ''

        if(moment().isAfter(due)){
            str = 'Passed Due'
        }
        else{
            str = 'Due ' + moment(due).from(start)
        }

        return str;
      }

      renderRow(rowData){

        var progress = Math.random();
        return(
        <TouchableHighlight
                onPress={() => this.onPressRow(rowData)}
                underlayColor='#ddd'
              >
            <View style={styles.List}>

                <Progress.Circle
                    style={styles.progress}
                    progress={progress}
                    indeterminate={this.state.indeterminate}
                    showsText={true}
                    color={this.changeColor(progress)}
                    direction="counter-clockwise"
                />

                <Text>{rowData.assignmentName}</Text>
                <Text style={{paddingLeft: 20}}>{this.displayDueDate(rowData.start, rowData.dueDate)}</Text>

            </View>
         </TouchableHighlight>
        )
      }

    render(){
        return(
            <ScrollView style={styles.container}>
                <Text style={{ padding: 20, justifyContent: 'center'}}>Assignment Dashboard</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections= {true}
                />

                <TouchableHighlight style={styles.button}
                    onPress={this.onAddPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Add
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.button}
                    onPress={this.onChatRoomPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Chat Room
                    </Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}


module.exports = Assignments;
