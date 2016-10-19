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

//TODO uses this variable to 
var Classes = require('./Classes');
var CONFIG = require('../../config.js');

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

    componentDidMount(){
            this.fetchTasks();
          }

    fetchTasks(){

    return fetch(CONFIG.server.host +'api/assignments/')
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
    onPressRow(rowData){

    this.props.navigator.push({
        id: 'AssignmentView',
        passProps: {
        classUrl: this.state.classUrl
        }
        });
    }

    renderRow(rowData){
        return(
            <View style={styles.List}>
                <Text>{rowData.assignmentName}</Text>
            </View>
        );
        }
        
    renderRow(rowData){

        return(
        <TouchableHighlight
                onPress={() => this.onPressRow(rowData)}
                underlayColor='#ddd'
              >
            <View style={styles.List}>

                <Text>{rowData.assignmentName}</Text>
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
