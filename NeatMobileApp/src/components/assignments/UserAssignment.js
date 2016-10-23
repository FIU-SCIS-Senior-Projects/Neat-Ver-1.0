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
  Image
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

import AssignmentForm from './AssignmentForm';
import AssignmentView from './AssignmentView';
import moment from 'moment';
import CONFIG from '../../config.js';

class Assignments extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds,
      //progress: 0.58,
      indeterminate: false
    };
  }

  componentDidMount() {
    this.fetchAssignments();
  }
  componentWillReceiveProps() {
    this.fetchAssignments();
  }

  fetchAssignments() {
    return fetch(CONFIG.server.host + '/assignments/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {

      var assignmentList = responseJson;

      //Sort by due date first
      assignmentList.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      //console log every assignment's name
      responseJson.map((assignment) => console.log(assignment.assignmentName));

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(assignmentList)
      })
    })
    .catch((error) => console.error(error));
  }

  onAddPressed() {
    this.props.navigator.push({
      id: 'ClassList',
      onPress: this.AddPressed,
      rightText: '+'

    });
  }

  onPressRow(rowData) {

    this.props.navigator.push({
        id: 'AssignmentView',
        title: rowData.assignmentName,
        passProps: {
          assignmentUrl: rowData.url,
          // title: rowData.assignmentName,
          onPress: this.AddPressed,
          rightText: '+'
        }
      });
  }

  changeColor(progress) {
    var color = '';
    if (progress < 0.33) {
      color = '#F44336';
    } else if (progress >= 0.33 && progress < 0.66) {
      color = '#ffcc00';
    } else {
      color = '#009688';
    }
    return color;
  }

  renderRow(rowData) {
    let numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
    var progress = Math.random();
    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#ddd">
        <View style={styles.List}>

          <Progress.Circle
            style={styles.progress}
            progress={progress}
            indeterminate={this.state.indeterminate}
            showsText={true}
            color={this.changeColor(progress)}
            direction="counter-clockwise"/>

          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text>{rowData.assignmentName}</Text>
          <Text>
            {moment().isAfter(rowData.dueDate)
              ? 'Passed Due' : 'Due ' + moment(rowData.dueDate).from(rowData.startDate)}
          </Text>
          <Text>
            {(numberOfTaskLeft > 0) ? 'Tasks Open ' + numberOfTaskLeft : null}
          </Text>
          </View>


        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <Image
        source={require('../../assets/img/blurback.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.label}>Dashboard</Text>
          <Text style={styles.heading}>
            Hello Ronica!
          </Text>
          <ListView
            style={{backgroundColor: 'transparent'}}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}/>

          <TouchableHighlight
            style={styles.button}
            onPress={this.onAddPressed.bind(this)}>
            <Text style={styles.buttonText}>
              Add
            </Text>
          </TouchableHighlight>
        </View>
      </Image>
    );
  }
}

module.exports = Assignments;
