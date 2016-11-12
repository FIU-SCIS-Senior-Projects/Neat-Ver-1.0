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
import moment from 'moment';
import styles from './styles';
import CONFIG from '../../config';
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
    AuthService.getLoginToken((err, authInfo) => {
      this.setState({
        authInfo,
      });
      this.fetchAssignments();
    });
    // this.setState({levels: (this.props.navigator.getCurrentRoutes(0).length)})
  }
  componentWillReceiveProps() {
    this.fetchAssignments();
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
  fetchAssignments() {
    return fetch(CONFIG.server.host + '/dashboard/', {
      method: 'GET',
      headers: this.state.authInfo.header,
    })
    .then((response) => response.json())
    .then((responseJson) => {
      const assignmentList = responseJson;
      // Sort by due date first
      // assignmentList.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(assignmentList),
      });
    })
    .catch((error) => console.error(error));
  }

  changeColor(progress) {
    let color = '';
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
    const numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
    // let numberOfTaskLeft = 2;
    const progress = Math.random();
    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={{ flexDirection: 'row', borderColor: '#2194f3', borderBottomWidth: 1 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Progress.Circle
              style={{ alignSelf: 'center', justifyContent: 'center', paddingTop: 5 }}
              progress={progress}
              size={55}
              indeterminate={false}
              showsText
              color={this.changeColor(progress)}
              direction="counter-clockwise"
            />
            <Text style={{ alignItems: 'flex-start', alignSelf: 'center', fontSize: 12, fontWeight: '300', paddingTop: 5 }}> {rowData.assignmentName}</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', alignSelf: 'auto' }}>
            <Text style={{ fontSize: 20 }}>
              {(numberOfTaskLeft > 0) ? numberOfTaskLeft + '  ' : null}
            </Text>
            <Text>Open Task</Text>
            <FontAwesome
              name="puzzle-piece"
              size={50}
              color="#2194f3"
            />
          </View>

          <View style={{ flex: 1, alignItems: 'center', alignSelf: 'center' }}>
            <Text>
              {moment().isAfter(rowData.dueDate)
                ? 'Past Due' : 'Due ' + moment(rowData.dueDate).from(rowData.startDate)}
            </Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }

  render() {
    // console.log('current routes', this.props.navigator.getCurrentRoutes(0));
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: 'Dashboard',
            tintColor: '#F5FCFF',
          }}
          rightButton={{
            title: <FontAwesome name="plus" size={25} />,
            handler: () => this.onAddPressed(),
            tintColor: '#F5FCFF',
          }}
          leftButton={{
            title: <FontAwesome name="sign-out" size={25} />,
            handler: () => AuthService.logout(),
            tintColor: '#F5FCFF',
          }}
          tintColor="#2194f3"
        />
        <Text style={styles.heading}>
          Hello Neat Dev Team!
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

Assignments.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = Assignments;
