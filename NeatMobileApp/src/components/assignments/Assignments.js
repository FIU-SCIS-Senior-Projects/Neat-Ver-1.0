import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  ListView
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

var AssignmentForm = require('./AssignmentForm');
var AssignmentView = require('./AssignmentView');
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
        return fetch('http://localhost:8000/api/assignments/')
              .then((response) => response.json())
              .then((responseJson) => {

                var assignmentList = responseJson;
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
            id: 'AssignmentForm',
            passProps: {
                classFK: 'http://localhost:8000/api/classes/2'
            }
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
        <TouchableHighlight
                onPress={() => this.onPressRow(rowData)}
                underlayColor='#ddd'
              >
            <View style={styles.List}>

                <Progress.Circle
                    style={styles.progress}
                    progress={this.state.progress}
                    indeterminate={this.state.indeterminate}
                    showsText={true}
                    color={this.changeColor(this.state.progress)}
                    direction="counter-clockwise"
                />

                <Text>{rowData.assignmentName}</Text>
                <Text style={{paddingLeft: 20}}>Due {moment(rowData.dueDate).from(rowData.startDate)}</Text>

            </View>
         </TouchableHighlight>
        )
      }

    render(){
        return(
            <View>
                <Text style={{ padding: 20, justifyContent: 'center'}}>Assignment Dashboard</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />

                <TouchableHighlight style={styles.button}
                    onPress={this.onAddPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Add Assignment
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}


module.exports = Assignments;
