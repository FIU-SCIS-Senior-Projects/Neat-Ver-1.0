import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Navigator,
  ListView,
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

var AssignmentForm = require('./AssignmentForm');
var AssignmentView = require('./AssignmentView');
var AssignmentRank = require('../assignmentRanking/AssignmentRank');

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


//<<<<<<< HEAD

      componentDidMount(){
        return fetch(CONFIG.server.host + '/assignments/', {
/*=======
      fetchAssignments(){
        return fetch(CONFIG.server.host + '/assignment/', {
>>>>>>> a214740c10ae83fffc4c06f22aa30930dcac0850*/
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

      onPressRow(rowData){

        this.props.navigator.push({
            id: 'AssignmentView',
            passProps: {
                assignmentUrl: rowData.url
            }
        });
        //console.log("the url:" + rowData.url);
      }

      onPressAssignmentProgress(rowData){
           //var id = rowData.url.split("/");

            this.props.navigator.push({
               id: 'AssignmentRank',
               passProps: {
                   assignmentUrl: rowData.url //id[5]
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
         // console.log(rowData.url);
        var progress = Math.random();
        return(
        <TouchableHighlight
                onPress={() => this.onPressRow(rowData)}
                underlayColor='#ddd'
              >
            <View style={styles.List}>
                <TouchableOpacity onPress={() =>
                    this.onPressAssignmentProgress(rowData)}>
                    <Progress.Circle
                        style={styles.progress}
                        progress={progress}
                        indeterminate={this.state.indeterminate}
                        showsText={true}
                        color={this.changeColor(progress)}
                        direction="counter-clockwise"
                    />
                </TouchableOpacity>
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
            </ScrollView>
        );
    }
}


module.exports = Assignments;
