import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';

import * as Progress from 'react-native-progress';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import styles from './styles';
import AuthService from '../../utilities/AuthService';

class Assignments extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      levels: 0,
      dataSource: ds,
      authInfo: null,
    };
  }

  componentDidMount() {
    this.getAssignments();
  }
  componentWillReceiveProps() {
    this.getAssignments();
  }

  onPressRow(rowData) {
    this.props.navigator.push({
      id: 'AssignmentView',
      title: rowData.assignmentName,
      passProps: {
        onPress: this.AddPressed,
        rowData,
      },
    });
  }

  onAddPressed() {
    this.props.navigator.push({
      id: 'AssignmentForm',
    });
  }
  getAssignments() {
    AuthService.getAssignments((assignmentList) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(assignmentList),
      });
    });
  }

  changeColor(progress, numTasks) {
    let color = '';
    if (numTasks === 0 || progress === 'Not Tracking Yet') {
      color = '#595959';
    } else if (progress === 'Significantly Behind') {
      color = '#F44336';
    } else if (progress === 'Considerably Behind') {
      color = '#ffcc00';
    } else if (progress === 'Slightly Behind') {
      color = '#e6e600';
    } else if (progress === 'On Track') {
      color = '#009688';
    }
    return color;
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }
  renderRow(rowData) {
    const numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
    // let numberOfTaskLeft = 2;
    const smartStatus = rowData['smart status'];

    let progress = rowData.progress; // Math.random();
    if (progress === 0 || rowData.tasks.length === 0) {
      progress = 0.0009;
    }

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

            <View style={{ flex: 1, alignItems: 'center', alignSelf: 'auto' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>
                  {(numberOfTaskLeft > 0) ? `${numberOfTaskLeft}  ` : null}
                </Text>
                <FontAwesome
                  name="puzzle-piece"
                  size={35}
                  color="#32C0B2"
                />
              </View>
              <Text>Open Task</Text>
            </View>

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

Assignments.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = Assignments;
