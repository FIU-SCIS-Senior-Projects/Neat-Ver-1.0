import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
  ListView
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

var AssignmentForm = require('./AssignmentForm');
var moment = require('moment');

class Assignments extends Component{
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
          dataSource: ds,
          progress: 0.58,
          indeterminate: false,
        };
      }

      componentDidMount(){
        this.fetchAssignments();
      }

      fetchAssignments(){
        return fetch('http://127.0.0.1:8000/api/assignments/?format=json')
              .then((response) => response.json())
              .then((responseJson) => {
                var assignmentList = responseJson.results;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(assignmentList)
                })
              })
              .catch((error) => {
                console.error(error);
              });

      }
      changeColor(progress){
      var color = ''
        if(progress < 0.33){
           color='F44336'
        }
        else if(progress >= 0.33 && progress < 0.66){
            color='#ffcc00'
        }
        else{
            color='#009688'
        }
        return color;
      }

      renderRow(rowData){
        return(
            <View style={styles.List}>

                <Text>{rowData.assignmentName}</Text>
                <Text style={{paddingLeft: 20}}>Due {moment(rowData.dueDate).from(rowData.startDate)}</Text>


                <Progress.Circle
                    style={styles.progress}
                    progress={this.state.progress}
                    indeterminate={this.state.indeterminate}
                    showsText="true"
                    color={this.changeColor(this.state.progress)}
                    direction="counter-clockwise"
                />

            </View>
        )
      }

    render(){
        return(
            <View>
                <Text style={{ padding: 10, justifyContent: 'center'}}>Assignment Dashboard</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />

                <TouchableHighlight
                    onPress={this.onAddPressed.bind(this)}
                    style={styles.button}>
                    <Text style={{ color: '#ffffff' }}>
                            Add Assignment
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }

    onAddPressed(){
        this.props.navigator.push({
              id: 'AssignmentForm'
            });
    }
}


module.exports = Assignments;