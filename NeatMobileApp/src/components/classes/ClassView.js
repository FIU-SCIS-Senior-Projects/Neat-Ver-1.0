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
import * as Progress from 'react-native-progress';

var Classes = require('./Classes');
var AssignmentForm = require('../assignments/AssignmentForm');
var moment = require('moment');

class ClassView extends Component{


    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            dataSource: ds,
            classUrl: props.classUrl,
            progress: 0.58,
            indeterminate: false,
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
                var display = [];
                var j = 0
                console.log(responseJson);
                for(var i = 0; i < responseJson.length; i++){
                    if(responseJson[i].classFK ===  this.state.classUrl){
                        display[j] = responseJson[i];
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
    console.log("ClassURL: " + this.state.classUrl)
        this.props.navigator.push({
            id: 'AssignmentForm',
            passProps:{
                classFK: this.state.classUrl
            }
        });
    }
    pressDashboard(){
         this.props.navigator.push({
            id: 'ClassDash'
        });
    }

    onPressRow(rowData){

    this.props.navigator.push({
        id: 'AssignmentView',
        passProps: {
        classUrl: this.state.classUrl
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
